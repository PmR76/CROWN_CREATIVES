#!/usr/bin/env node

/* ============================================================
   CROWN CREATIVES — SCANNER v3 (STABLE EDITION)
   Full-project scan → JSON report → TXT summary
   Migration disabled for stability
============================================================ */

import fs from "fs";
import path from "path";

/* ------------------------------------------------------------
   1. LOAD CONFIG
------------------------------------------------------------ */
const CONFIG = JSON.parse(
  fs.readFileSync(new URL("./config.json", import.meta.url), "utf8")
);

/* ------------------------------------------------------------
   2. IGNORE RULES
------------------------------------------------------------ */
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

const CONFIG_IGNORE_DIRS = Array.isArray(CONFIG.ignoreDirs)
  ? CONFIG.ignoreDirs
  : [];

/* ------------------------------------------------------------
   3. SINGLE ROOT (THE VERSION THAT WORKED)
------------------------------------------------------------ */
const SCAN_ROOT = CONFIG.projectRoot;
console.log("🔍 SCANNING:", SCAN_ROOT);

/* ------------------------------------------------------------
   4. DIRECTORY WALKER
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
   5. CLASSIFY MODULE
------------------------------------------------------------ */
function classifyModule(filePath, content) {
  const rel = filePath.replace(CONFIG.projectRoot, "").replace(/\\/g, "/");

  let scope = "unknown";
  if (rel.includes("/test/")) scope = "test";
  else if (rel.includes("/assets/")) scope = "asset";
  else if (rel.includes("/master/")) scope = "master";
  else if (rel.includes("/pages/")) scope = "page";
  else if (rel.includes("/scripts/")) scope = "script";

  let kind = "neutral";

  return { scope, kind, rel };
}

/* ------------------------------------------------------------
   6. DETECT ISSUES
------------------------------------------------------------ */
function detectIssues(filePath, content) {
  const issues = [];

  if (filePath.endsWith(".css")) {
    if (/z-index:\s*(\d{4,})/i.test(content)) issues.push("z-index-insane");
    if (/(html|body)\s*\{[^}]*overflow:\s*hidden[^}]*\}/gi.test(content))
      issues.push("overflow-hidden-html-body");
  }

  if (filePath.endsWith(".js")) {
    if (/window\.onload\s*=/i.test(content))
      issues.push("legacy-window-onload");
  }

  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) {
    const lower = content.toLowerCase();
    const bgCount = (lower.match(/id="cc-background"/g) || []).length;
    if (bgCount > 1) issues.push("duplicate-cc-background");
  }

  return issues;
}

/* ------------------------------------------------------------
   7. MIGRATION DISABLED (STABLE MODE)
------------------------------------------------------------ */
function migrateIfNeeded() {
  return null;
}

/* ------------------------------------------------------------
   8. BUILD REPORT
------------------------------------------------------------ */
function buildReport(scanResults) {
  return {
    projectRoot: CONFIG.projectRoot,
    scannedAt: new Date().toISOString(),
    modules: scanResults
  };
}

/* ------------------------------------------------------------
   9. WRITE REPORTS
------------------------------------------------------------ */
function writeReports(report) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const jsonPath = `./reports/scan-${timestamp}.json`;
  const txtPath = `./reports/scan-${timestamp}.txt`;

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const txt = report.modules
    .map(m => {
      return `[${m.scope.toUpperCase()}] ${m.rel}
Issues: ${m.issues.join(", ") || "none"}
Actions: ${m.actions.join(", ") || "none"}
`;
    })
    .join("\n");

  fs.writeFileSync(txtPath, txt);

  console.log("JSON report:", jsonPath);
  console.log("TXT summary:", txtPath);
}

/* ------------------------------------------------------------
   10. MAIN SCAN PROCESS
------------------------------------------------------------ */
async function runScanner() {
  const allFiles = walk(SCAN_ROOT);
  const results = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf8");

    const meta = classifyModule(file, content);
    const issues = detectIssues(file, content);

    const actions = [];
    const migrated = migrateIfNeeded();
    if (migrated) actions.push("migrated → " + migrated);

    results.push({
      path: file,
      rel: meta.rel,
      scope: meta.scope,
      kind: meta.kind,
      issues,
      actions
    });
  }

  const report = buildReport(results);
  writeReports(report);

  console.log("🎉 SCAN COMPLETE");

  return { message: "Scan complete", report };
}

/* ------------------------------------------------------------
   11. EXPORT FOR SERVER
------------------------------------------------------------ */
export async function runScan() {
  return await runScanner();
}
