#!/usr/bin/env node
import fs from "fs";
import path from "path";

const REPORTS_DIR = path.resolve("./reports");
const KEEP_CONFIG = path.resolve("./backup-keep.json");
const LOG_DIR = path.resolve("./tools/gr3-auto-fix/logs");
const MANIFEST_PATH = path.resolve("./tools/gr3-auto-fix/last-run.json");

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function getLatestReportPath() {
  if (!fs.existsSync(REPORTS_DIR)) throw new Error("reports directory not found");
  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort();
  if (!files.length) throw new Error("no scan-*.json reports found");
  return path.join(REPORTS_DIR, files[files.length - 1]);
}

function loadReport(reportPath) {
  return JSON.parse(fs.readFileSync(reportPath, "utf8"));
}

function loadKeepConfig() {
  if (!fs.existsSync(KEEP_CONFIG)) return { keep: [] };
  try {
    return JSON.parse(fs.readFileSync(KEEP_CONFIG, "utf8"));
  } catch {
    return { keep: [] };
  }
}

/* ---------- CLI options ---------- */

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    mode: "safe", // safe | aggressive
    onlyIssue: null,
    onlyScope: null,
    onlyKind: null,
    onlyFile: null,
  };

  for (const arg of argv.slice(2)) {
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg.startsWith("--mode=")) opts.mode = arg.split("=")[1];
    else if (arg.startsWith("--only-issue=")) opts.onlyIssue = arg.split("=")[1];
    else if (arg.startsWith("--only-scope=")) opts.onlyScope = arg.split("=")[1];
    else if (arg.startsWith("--only-kind=")) opts.onlyKind = arg.split("=")[1];
    else if (arg.startsWith("--only-file=")) opts.onlyFile = arg.split("=")[1];
  }

  return opts;
}

/* ---------- Patch helpers ---------- */

function patchCss(content, issues, mode) {
  let out = content;

  if (issues.includes("z-index-insane")) {
    out = out.replace(/z-index:\s*\d{4,}/gi, "z-index: 500; /* GR3 normalised */");
  }

  if (issues.includes("full-screen-fixed-block")) {
    out = out.replace(
      /([^{]+)\{[^}]*position:\s*fixed[^}]*top:\s*0[^}]*left:\s*0[^}]*width:\s*(100%|100vw)[^}]*height:\s*(100%|100vh)[^}]*\}/gi,
      "/* GR3 removed full-screen fixed block */"
    );
  }

  if (issues.includes("overflow-hidden-html-body")) {
    out = out.replace(
      /(html|body)\s*\{[^}]*overflow:\s*hidden[^}]*\}/gi,
      "/* GR3 removed overflow hidden on root */"
    );
  }

  if (issues.includes("important-on-root")) {
    out = out.replace(
      /(html|body)[^{]+\{[^}]*!important[^}]*\}/gi,
      "/* GR3 removed !important on root */"
    );
  }

  // Example of "aggressive" extras
  if (mode === "aggressive") {
    out = out.replace(/z-index:\s*(\d{3,})/gi, "z-index: 400; /* GR3 aggressive normalised */");
  }

  return out;
}

function patchJs(content, issues, mode) {
  let out = content;

  if (issues.includes("js-body-overflow-hidden")) {
    out = out.replace(
      /document\.body\.style\.overflow\s*=\s*['"]hidden['"]/gi,
      "// GR3 removed body overflow hidden"
    );
  }

  if (issues.includes("js-html-overflow-hidden")) {
    out = out.replace(
      /document\.documentElement\.style\.overflow\s*=\s*['"]hidden['"]/gi,
      "// GR3 removed html overflow hidden"
    );
  }

  if (issues.includes("legacy-window-onload")) {
    out = out.replace(
      /window\.onload\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\};?/gi,
      "// GR3 removed legacy window.onload block"
    );
  }

  if (issues.includes("js-body-style-mutation")) {
    out = out.replace(
      /document\.querySelector\(['"]body['"]\)[\s\S]*?\.style\.[^=]+=/gi,
      match => `// GR3 review: body style mutation\n// ${match}`
    );
  }

  if (mode === "aggressive") {
    out = out.replace(/alert\(/g, "// GR3 aggressive: alert disabled\n// alert(");
  }

  return out;
}

function patchHtml(content, issues, mode) {
  let out = content;

  if (issues.includes("duplicate-cc-background")) {
    out = out.replace(
      /id="cc-background"/g,
      'id="cc-background" data-gr3="duplicate-check"'
    );
  }

  if (issues.includes("html-full-screen-overlay")) {
    out = out.replace(
      /<div([^>]+)style=["'][^"']*(position:\s*fixed)[^"']*(top:\s*0)[^"']*(left:\s*0)[^"']*(width:\s*100%|100vw)[^"']*(height:\s*100%|100vh)[^"']*["'][^>]*>/gi,
      '<!-- GR3 removed full-screen overlay div -->'
    );
  }

  if (mode === "aggressive") {
    out = out.replace(/<body([^>]*)onload=/gi, '<body$1 data-gr3-onload-removed=');
  }

  return out;
}

/* ---------- Patch application + preview ---------- */

function shouldProcessModule(mod, opts) {
  if (opts.onlyScope && mod.scope !== opts.onlyScope) return false;
  if (opts.onlyKind && mod.kind !== opts.onlyKind) return false;
  if (opts.onlyFile && mod.rel !== opts.onlyFile && mod.path !== opts.onlyFile) return false;
  if (opts.onlyIssue && !(mod.issues || []).includes(opts.onlyIssue)) return false;
  return true;
}

function applyPatchesForModule(mod, keepConfig, opts) {
  const filePath = mod.path;
  const issues = mod.issues || [];
  if (!issues.length) return null;
  if (!fs.existsSync(filePath)) return null;
  if (!shouldProcessModule(mod, opts)) return { skipped: true, reason: "filter", file: filePath };

  const rel = mod.rel || filePath;
  if (keepConfig.keep && keepConfig.keep.includes(rel) && opts.mode === "safe") {
    return { file: filePath, skipped: true, reason: "keep-config" };
  }

  const original = fs.readFileSync(filePath, "utf8");
  let patched = original;

  if (filePath.endsWith(".css")) {
    patched = patchCss(patched, issues, opts.mode);
  } else if (filePath.endsWith(".js")) {
    patched = patchJs(patched, issues, opts.mode);
  } else if (filePath.endsWith(".html") || filePath.endsWith(".htm")) {
    patched = patchHtml(patched, issues, opts.mode);
  } else {
    return { file: filePath, skipped: true, reason: "unsupported" };
  }

  if (patched === original) {
    return { file: filePath, skipped: true, reason: "no-change" };
  }

  // Patch preview (for dashboard use)
  const preview = {
    before: original,
    after: patched,
  };

  if (opts.dryRun) {
    return {
      file: filePath,
      issuesFixed: issues,
      backup: null,
      skipped: false,
      dryRun: true,
      preview,
    };
  }

  const bakPath = filePath + ".gr3.bak";
  if (!fs.existsSync(bakPath)) {
    fs.writeFileSync(bakPath, original, "utf8");
  }

  fs.writeFileSync(filePath, patched, "utf8");

  return {
    file: filePath,
    issuesFixed: issues,
    backup: bakPath,
    skipped: false,
    dryRun: false,
    preview,
  };
}

/* ---------- Undo last fix ---------- */

function undoLastFix() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error("No last-run manifest found.");
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const backups = manifest.backups || [];
  let restored = 0;

  for (const b of backups) {
    if (!fs.existsSync(b.backup)) continue;
    if (!fs.existsSync(b.target)) continue;
    const original = fs.readFileSync(b.backup, "utf8");
    fs.writeFileSync(b.target, original, "utf8");
    restored++;
  }

  return { restored, total: backups.length };
}

/* ---------- Logging ---------- */

function writeLog(summary) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const logPath = path.join(LOG_DIR, `fix-${ts}.json`);
  fs.writeFileSync(logPath, JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(summary, null, 2), "utf8");
}

/* ---------- Main ---------- */

async function runAutoFix(options = null) {
  const opts = options || parseArgs(process.argv);
  const reportPath = getLatestReportPath();
  const report = loadReport(reportPath);
  const keepConfig = loadKeepConfig();

  const modules = report.modules || [];
  const fixes = [];
  const backupsManifest = [];
  let skipped = 0;

  for (const mod of modules) {
    const result = applyPatchesForModule(mod, keepConfig, opts);
    if (!result) continue;
    if (result.skipped) {
      skipped++;
      continue;
    }
    fixes.push(result);
    if (!opts.dryRun && result.backup) {
      backupsManifest.push({ backup: result.backup, target: result.file });
    }
    console.log(
      (opts.dryRun ? "[DRY]" : "[FIX]"),
      result.file,
      "issues:",
      (result.issuesFixed || []).join(", ")
    );
  }

  const summary = {
    timestamp: new Date().toISOString(),
    mode: opts.mode,
    dryRun: opts.dryRun,
    onlyIssue: opts.onlyIssue,
    onlyScope: opts.onlyScope,
    onlyKind: opts.onlyKind,
    onlyFile: opts.onlyFile,
    fixedCount: fixes.length,
    skipped,
    backups: backupsManifest,
  };

  if (!opts.dryRun) {
    writeLog(summary);
  }

  if (require.main === module) {
    console.log(
      `🎉 GR3.5 complete — ${fixes.length} files ${opts.dryRun ? "would be" : "were"} patched, ${skipped} skipped.`
    );
  } else {
    return summary;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--undo")) {
    try {
      const res = undoLastFix();
      console.log(`Undo complete — restored ${res.restored}/${res.total} files.`);
    } catch (err) {
      console.error("Undo failed:", err.message);
      process.exit(1);
    }
  } else {
    runAutoFix().catch(err => {
      console.error("GR3.5 auto-fix failed:", err);
      process.exit(1);
    });
  }
}

export { runAutoFix, undoLastFix };
