#!/usr/bin/env node

/* ============================================================
   CROWN CREATIVES — SCANNER v3 (HYBRID EDITION)
   Full-project scan → JSON report → TXT summary
   Auto-migrate ONLY /test modules
============================================================ */

import fs from "fs";
import path from "path";

/* ------------------------------------------------------------
   LEGACY PATTERN HELPERS
------------------------------------------------------------ */
function looksLegacyCss(content) {
  if (/z-index:\s*9{3,6}/i.test(content)) return true;
  if (/position:\s*fixed/i.test(content) && /top:\s*0/i.test(content) && /left:\s*0/i.test(content)) return true;
  if (/overflow:\s*hidden/i.test(content) && /(html|body)/i.test(content)) return true;
  if (/!important/.test(content) && /body|html/.test(content)) return true;
  return false;
}

function looksGr1Css(content) {
  if (/cc-footer|cc-header|cc-ticker|cc-hero/i.test(content)) return true;
  if (/back-to-top/i.test(content)) return true;
  if (/--cc-/i.test(content)) return true;
  return false;
}

function looksLegacyJs(content) {
  if (/document\.body\.style\.overflow\s*=\s*['"]hidden['"]/i.test(content)) return true;
  if (/document\.documentElement\.style\.overflow\s*=\s*['"]hidden['"]/i.test(content)) return true;
  if (/addEventListener\(['"]load['"],\s*function/i.test(content)) return true;
  if (/window\.onload\s*=/i.test(content)) return true;
  return false;
}

function looksGr1Js(content) {
  if (/initThemeEngine|initSoundEngine|initBackToTop|initHeroCrown|initThemePanel/i.test(content)) return true;
  if (/admin-mode/.test(content)) return true;
  if (/localStorage\.setItem\("footer-pos-/i.test(content)) return true;
  return false;
}

/* ------------------------------------------------------------
   1. LOAD CONFIG
------------------------------------------------------------ */
const CONFIG = JSON.parse(
  fs.readFileSync("./config.json", "utf8")
);

/* ------------------------------------------------------------
   2. UTILITY — WALK DIRECTORY (with ignore list)
------------------------------------------------------------ */
const IGNORE_DIRS = [".git"];

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (IGNORE_DIRS.includes(file)) return;
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

/* ------------------------------------------------------------
   3. CLASSIFY MODULE (enhanced)
------------------------------------------------------------ */
function classifyModule(filePath, content) {
  const rel = filePath.replace(CONFIG.projectRoot, "").replace(/\\/g, "/");

  let scope = "unknown";
  if (rel.includes("/test/")) scope = "test";
  else if (rel.includes("/assets/")) scope = "asset";
  else if (rel.includes("/master/")) scope = "master";
  else if (rel.includes("/pages/")) scope = "page";
  else if (rel.includes("/scripts/")) scope = "script";

  let kind = "unknown";

  if (filePath.endsWith(".css")) {
    const legacy = looksLegacyCss(content);
    const gr1 = looksGr1Css(content);
    if (legacy && gr1) kind = "hybrid";
    else if (legacy) kind = "legacy";
    else if (gr1) kind = "gr1";
    else kind = "neutral";
  } else if (filePath.endsWith(".js")) {
    const legacy = looksLegacyJs(content);
    const gr1 = looksGr1Js(content);
    if (legacy && gr1) kind = "hybrid";
    else if (legacy) kind = "legacy";
    else if (gr1) kind = "gr1";
    else kind = "neutral";
  } else {
    kind = "neutral";
  }

  return { scope, kind, rel };
}

/* ------------------------------------------------------------
   4. DETECT ISSUES (legacy-focused)
------------------------------------------------------------ */
function detectIssues(filePath, content) {
  const issues = [];

  if (filePath.endsWith(".css")) {
    if (/z-index:\s*(\d{4,})/i.test(content)) issues.push("z-index-insane");
    if (/(html|body)\s*\{[^}]*overflow:\s*hidden[^}]*\}/gi.test(content)) issues.push("overflow-hidden-html-body");

    if (/position:\s*fixed/i.test(content) &&
        /top:\s*0/i.test(content) &&
        /left:\s*0/i.test(content) &&
        /(width:\s*100%|width:\s*100vw)/i.test(content) &&
        /(height:\s*100%|height:\s*100vh)/i.test(content)) {
      issues.push("full-screen-fixed-block");
    }

    if (/!important/.test(content) && /(html|body)/i.test(content)) issues.push("important-on-root");
  }

  if (filePath.endsWith(".js")) {
    if (/document\.body\.style\.overflow\s*=\s*['"]hidden['"]/i.test(content)) issues.push("js-body-overflow-hidden");
    if (/document\.documentElement\.style\.overflow\s*=\s*['"]hidden['"]/i.test(content)) issues.push("js-html-overflow-hidden");
    if (/querySelector\(['"]body['"]\)/i.test(content) && /\.style\./i.test(content)) issues.push("js-body-style-mutation");
    if (/window\.onload\s*=/i.test(content)) issues.push("legacy-window-onload");
  }

  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) {
    const lower = content.toLowerCase();
    const bgCount = (lower.match(/id="cc-background"/g) || []).length;
    if (bgCount > 1) issues.push("duplicate-cc-background");

    const overlayRegex = /<div[^>]+style=["'][^"']*(position:\s*fixed)[^"']*(top:\s*0)[^"']*(left:\s*0)[^"']*(width:\s*100%|100vw)[^"']*(height:\s*100%|100vh)[^"']*["'][^>]*>/gi;
    if (overlayRegex.test(content)) issues.push("html-full-screen-overlay");
  }

  return issues;
}

/* ------------------------------------------------------------
   5. AUTO-MIGRATE ENGINE (GR1 — ONLY /test)
------------------------------------------------------------ */
function migrateIfNeeded(filePath, content, meta) {
  if (meta.scope !== "test") return null;
  if (meta.kind !== "legacy" && meta.kind !== "hybrid") return null;

  const relative = meta.rel.replace("/test/", "");
  const target = path.join(CONFIG.projectRoot, "test/migrated", relative);

  fs.mkdirSync(path.dirname(target), { recursive: true });

  const bak = filePath + ".bak";
  if (!fs.existsSync(bak)) fs.copyFileSync(filePath, bak);

  const rewritten = rewriteToGR1(filePath, content, meta);
  fs.writeFileSync(target, rewritten, "utf8");

  return target;
}

/* ------------------------------------------------------------
   5b. GR1 REWRITER ENGINE (Phase 2)
------------------------------------------------------------ */
function rewriteToGR1(filePath, content, meta) {
  if (meta.scope !== "test") return content;
  if (meta.kind !== "legacy" && meta.kind !== "hybrid") return content;

  let rewritten = content;

  if (filePath.endsWith(".css")) {
    rewritten = rewritten.replace(/z-index:\s*\d{4,}/gi, "z-index: 500; /* GR1 normalised */");

    rewritten = rewritten.replace(
      /([^{]+)\{[^}]*position:\s*fixed[^}]*top:\s*0[^}]*left:\s*0[^}]*width:\s*(100%|100vw)[^}]*height:\s*(100%|100vh)[^}]*\}/gi,
      "/* GR1 removed full-screen fixed block */"
    );

    rewritten = rewritten.replace(
      /(html|body)\s*\{[^}]*overflow:\s*hidden[^}]*\}/gi,
      "/* GR1 removed overflow hidden on root */"
    );

    rewritten = rewritten.replace(
      /(html|body)[^{]+\{[^}]*!important[^}]*\}/gi,
      "/* GR1 removed !important on root */"
    );

    rewritten =
`/* ============================================================
   GR1 AUTO-MIGRATED MODULE
   Source: ${meta.rel}
   Type: ${meta.kind}
   Date: ${new Date().toISOString()}
============================================================ */\n\n` + rewritten;
  }

  if (filePath.endsWith(".js")) {
    rewritten = rewritten.replace(
      /document\.body\.style\.overflow\s*=\s*['"]hidden['"]/gi,
      "// GR1 removed body overflow hidden"
    );

    rewritten = rewritten.replace(
      /document\.documentElement\.style\.overflow\s*=\s*['"]hidden['"]/gi,
      "// GR1 removed html overflow hidden"
    );

    rewritten = rewritten.replace(
      /window\.onload\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\};?/gi,
      "// GR1 removed legacy window.onload block"
    );

    rewritten =
`/* ============================================================
   GR1 AUTO-MIGRATED JS MODULE
   Source: ${meta.rel}
   Type: ${meta.kind}
   Date: ${new Date().toISOString()}
============================================================ */\n\n` + rewritten;
  }

  return rewritten;
}

/* ------------------------------------------------------------
   6. CREATIVE MODE ENGINE (Phase 3)
------------------------------------------------------------ */
function generateCreativeSuggestions(scanResults) {
  const suggestions = [];

  for (const m of scanResults) {
    const isCss = m.path.endsWith(".css");
    const isJs = m.path.endsWith(".js");

    if (!isCss && !isJs) continue;
    if (m.kind === "neutral") continue;

    if (m.rel.includes("/footer/") && isCss) {
      suggestions.push({
        path: m.rel,
        type: "ui-upgrade",
        message: "Footer module could use GR1 glow engine and theme variables.",
      });
    }

    if (m.rel.includes("/hero-window/") && isCss) {
      suggestions.push({
        path: m.rel,
        type: "cinematic-upgrade",
        message: "Hero window could be converted to GR1 Hero Engine v2 with cinematic glow.",
      });
    }

    if (m.rel.includes("/ticker/") && isCss) {
      suggestions.push({
        path: m.rel,
        type: "motion-upgrade",
        message: "Ticker module could use smoother GR1 keyframe animations and OS-level timing.",
      });
    }

    if (m.rel.includes("/gallery/") && isCss) {
      suggestions.push({
        path: m.rel,
        type: "visual-refresh",
        message: "Gallery appears legacy; consider GR1 gallery module with layered depth and theme integration.",
      });
    }

    if (m.scope === "test" && (m.kind === "legacy" || m.kind === "hybrid")) {
      suggestions.push({
        path: m.rel,
        type: "migration-followup",
        message: "Migrated test module could be manually reviewed for GR1 naming, selectors, and animations.",
      });
    }

    if (m.scope === "asset" && m.kind === "legacy") {
      suggestions.push({
        path: m.rel,
        type: "asset-advisory",
        message: "Legacy asset module detected; consider future GR1 upgrade when moving out of test sandbox.",
      });
    }
  }

  return suggestions;
}

/* ------------------------------------------------------------
   7. BUILD REPORT OBJECT
------------------------------------------------------------ */
function buildReport(scanResults) {
  const creative = generateCreativeSuggestions(scanResults);

  return {
    projectRoot: CONFIG.projectRoot,
    scannedAt: new Date().toISOString(),
    modules: scanResults,
    creative,
  };
}

/* ------------------------------------------------------------
   8. WRITE JSON + TXT REPORTS
------------------------------------------------------------ */
function writeReports(report) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const jsonPath = `./reports/scan-${timestamp}.json`;
  const txtPath = `./reports/scan-${timestamp}.txt`;

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const txt = report.modules
    .map(m => {
      return `[${m.scope.toUpperCase()}/${m.kind.toUpperCase()}] ${m.rel}
Issues: ${m.issues.join(", ") || "none"}
Actions: ${m.actions.join(", ") || "none"}
`;
    })
    .join("\n");

  fs.writeFileSync(txtPath, txt);

  if (report.creative && report.creative.length > 0) {
    const creativeTxt = report.creative
      .map(c => `[#CREATIVE] ${c.path}\nType: ${c.type}\nSuggestion: ${c.message}\n`)
      .join("\n");

    fs.appendFileSync(txtPath, `\n\n=== CREATIVE SUGGESTIONS ===\n\n${creativeTxt}`);
  }

  console.log("JSON report:", jsonPath);
  console.log("TXT summary:", txtPath);
}

/* ------------------------------------------------------------
   9. MAIN SCAN PROCESS (GR1-corrected)
------------------------------------------------------------ */
async function runScanner() {
  const root = process.argv[2] || CONFIG.projectRoot;

  console.log("🔍 SCANNING:", root);

  const allFiles = walk(root);
  const results = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf8");

    const meta = classifyModule(file, content);
    const issues = detectIssues(file, content);

    const actions = [];

    const migrated = migrateIfNeeded(file, content, meta);
    if (migrated) actions.push("migrated → " + migrated);

    results.push({
      path: file,
      rel: meta.rel,
      scope: meta.scope,
      kind: meta.kind,
      issues,
      actions,
    });
  }

  const report = buildReport(results);
  writeReports(report);

  console.log("🎉 SCAN COMPLETE");
}

/* ------------------------------------------------------------
   10. START
------------------------------------------------------------ */
runScanner();
