#!/usr/bin/env node
import fs from "fs";
import path from "path";

const REPORTS_DIR = path.resolve("./reports");
const KEEP_CONFIG = path.resolve("./backup-keep.json");

/* ---- Report helpers ---- */
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

/* ---- Patch helpers ---- */
function patchCss(content, issues) {
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
  return out;
}

function patchJs(content, issues) {
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
  return out;
}

function patchHtml(content, issues) {
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
  return out;
}

function applyPatchesForModule(mod, keepConfig) {
  const filePath = mod.path;
  const issues = mod.issues || [];
  if (!issues.length) return null;
  if (!fs.existsSync(filePath)) return null;

  const rel = mod.rel || filePath;
  if (keepConfig.keep && keepConfig.keep.includes(rel)) {
    return { file: filePath, skipped: true, reason: "keep-config" };
  }

  const original = fs.readFileSync(filePath, "utf8");
  let patched = original;

  if (filePath.endsWith(".css")) {
    patched = patchCss(patched, issues);
  } else if (filePath.endsWith(".js")) {
    patched = patchJs(patched, issues);
  } else if (filePath.endsWith(".html") || filePath.endsWith(".htm")) {
    patched = patchHtml(patched, issues);
  } else {
    return null;
  }

  if (patched === original) return null;

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
  };
}

/* ---------- Undo last fix (restore all .gr3.bak) ---------- */

function undoLastFix() {
  const projectRoot = path.resolve(".");
  const backups = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".git" || e.name === "reports") continue;
        walk(full);
      } else if (e.isFile() && full.endsWith(".gr3.bak")) {
        backups.push(full);
      }
    }
  }

  walk(projectRoot);

  let restored = 0;
  for (const bak of backups) {
    const target = bak.replace(/\.gr3\.bak$/, "");
    if (!fs.existsSync(bak)) continue;
    const original = fs.readFileSync(bak, "utf8");
    fs.writeFileSync(target, original, "utf8");
    restored++;
  }

  return { restored, total: backups.length };
}

/* ---------- Main auto-fix runner ---------- */

async function runAutoFix(options = {}) {
  const reportPathArg = options.reportPath || process.argv[2];
  const reportPath = reportPathArg || getLatestReportPath();
  const report = loadReport(reportPath);
  const keepConfig = loadKeepConfig();

  const modules = report.modules || [];
  const fixes = [];
  let skipped = 0;

  for (const mod of modules) {
    const result = applyPatchesForModule(mod, keepConfig);
    if (!result) continue;
    if (result.skipped) {
      skipped++;
      continue;
    }
    fixes.push(result);
    console.log("✔ Fixed:", result.file, "issues:", result.issuesFixed.join(", "));
  }

  const summary = {
    fixedCount: fixes.length,
    skipped,
  };

  return summary;
}

/* ---------- CLI entrypoint ---------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  runAutoFix().then(summary => {
    console.log(`🎉 GR3 complete — ${summary.fixedCount} files patched, ${summary.skipped} skipped.`);
  }).catch(err => {
    console.error("GR3 auto-fix failed:", err);
    process.exit(1);
  });
}

export { runAutoFix, undoLastFix };
