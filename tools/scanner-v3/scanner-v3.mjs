#!/usr/bin/env node

/* ============================================================
   CROWN CREATIVES — SCANNER v3 (HYBRID EDITION)
   Full-project scan → JSON report → TXT summary
   Auto-migrate ONLY /test modules
============================================================ */

import fs from "fs";
import path from "path";

/* ------------------------------------------------------------
   1. LOAD CONFIG
------------------------------------------------------------ */
const CONFIG = JSON.parse(
  fs.readFileSync(new URL("./config.json", import.meta.url), "utf8")
);

// Directories we NEVER scan
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".github",
  "scanner-v3",
  "dashboard-control",
  "backups",
  "reports",
  "tools"
]);

// Optional ignore dirs from config.json
const CONFIG_IGNORE_DIRS = Array.isArray(CONFIG.ignoreDirs)
  ? CONFIG.ignoreDirs
  : [];

// Determine scan roots safely (MULTI-ROOT SUPPORT)
const SCAN_ROOTS = Array.isArray(CONFIG.paths) && CONFIG.paths.length > 0
  ? CONFIG.paths
  : [CONFIG.projectRoot];

console.log("🔍 SCANNING:", SCAN_ROOTS.join(", "));

/* ------------------------------------------------------------
   2. DIRECTORY WALKER (FINAL VERSION)
------------------------------------------------------------ */
function shouldIgnoreDir(fullPath) {
  const base = path.basename(fullPath);
  if (IGNORE_DIRS.has(base)) return true;
  if (CONFIG_IGNORE_DIRS.includes(base)) return true;
  return false;
}

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldIgnoreDir(full)) continue;
      walk(full, fileList);
    } else {
      fileList.push(full);
    }
  }

  return fileList;
}

/* ------------------------------------------------------------
   3. CLASSIFY MODULE
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
   4. DETECT ISSUES
------------------------------------------------------------ */
function detectIssues(filePath, content) {
  const issues = [];

  if (filePath.endsWith(".css")) {
    if (/z-index:\s*(\d{4,})/i.test(content)) issues.push("z-index-insane");
    if (/(html|body)\s*\{[^}]*overflow:\s*hidden[^}]*\}/gi.test(content))
      issues.push("overflow-hidden-html-body");

    if (/position:\s*fixed/i.test(content) &&
        /top:\s*0/i.test(content) &&
        /left:\s*0/i.test(content) &&
        /(width:\s*100%|width:\s*100vw)/i.test(content) &&
        /(height:\s*100%|height:\s*100vh)/i.test(content)) {
      issues.push("full-screen-fixed-block");
    }

    if (/!important/.test(content) && /(html|body)/i.test(content))
      issues.push("important-on-root");
  }

  if (filePath.endsWith(".js")) {
    if (/document\.body\.style\.overflow\s*=\s*['"]hidden['"]/i.test(content))
      issues.push("js-body-overflow-hidden");
    if (/document\.documentElement\.style\.overflow\s*=\s*['"]hidden['"]/i.test(content))
      issues.push("js-html-overflow-hidden");
    if (/querySelector\(['"]body['"]\)/i.test(content) && /\.style\./i.test(content))
      issues.push("js-body-style-mutation");
    if (/window\.onload\s*=/i.test(content))
      issues.push("legacy-window-onload");
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
function migrateIfNeeded() {
  return null;
}

/* ------------------------------------------------------------
   6. CREATIVE MODE ENGINE
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
   9. MAIN SCAN PROCESS
------------------------------------------------------------ */
async function runScanner() {

  // ⭐ MULTI-ROOT SCAN ⭐
  let allFiles = [];
  for (const root of SCAN_ROOTS) {
    allFiles = allFiles.concat(walk(root));
  }

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

  return { message: "Scan complete", report };
}

/* ------------------------------------------------------------
   10. EXPORT FOR SERVER
------------------------------------------------------------ */
export async function runScan() {
  return await runScanner();
}
/* ------------------------------------------------------------
   11. RUN DIRECTLY FROM CLI
------------------------------------------------------------ */
if (import.meta.url === `file://${process.argv[1]}`) {
  runScanner();
}
