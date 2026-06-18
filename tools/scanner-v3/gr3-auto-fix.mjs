#!/usr/bin/env node

/* ============================================================
   CROWN CREATIVES — GR3 AUTO-FIX ENGINE (Phase 5)
   Consumes scanner JSON → applies patches in-place
   Creates .bak backups before modifying files
============================================================ */

import fs from "fs";
import path from "path";

/* ------------------------------------------------------------
   1. LOAD LATEST REPORT
------------------------------------------------------------ */
function getLatestReportPath() {
  const reportsDir = "./reports";
  if (!fs.existsSync(reportsDir)) {
    throw new Error("reports directory not found");
  }

  const files = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith("scan-") && f.endsWith(".json"))
    .sort(); // ISO timestamp in name → lexicographic sort works

  if (files.length === 0) {
    throw new Error("no scan-*.json reports found");
  }

  return path.join(reportsDir, files[files.length - 1]);
}

function loadReport(reportPath) {
  const raw = fs.readFileSync(reportPath, "utf8");
  return JSON.parse(raw);
}

/* ------------------------------------------------------------
   2. PATCH HELPERS (CSS / JS / HTML)
------------------------------------------------------------ */
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
    // Soft-touch: comment direct body style mutations
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
    // Leave a marker for manual review; auto-removal is risky
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

/* ------------------------------------------------------------
   3. APPLY PATCHES PER MODULE
------------------------------------------------------------ */
function applyPatchesForModule(mod) {
  const filePath = mod.path;
  const issues = mod.issues || [];

  if (!issues.length) return null;

  if (!fs.existsSync(filePath)) {
    console.warn("⚠️ File missing for module:", filePath);
    return null;
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

  if (patched === original) {
    return null;
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
  };
}

/* ------------------------------------------------------------
   4. MAIN GR3 AUTO-FIX PROCESS
------------------------------------------------------------ */
async function runAutoFix() {
  const reportPathArg = process.argv[2];
  const reportPath = reportPathArg || getLatestReportPath();

  console.log("🛠 GR3 AUTO-FIX using report:", reportPath);

  const report = loadReport(reportPath);
  const modules = report.modules || [];

  const fixes = [];

  for (const mod of modules) {
    const result = applyPatchesForModule(mod);
    if (result) {
      fixes.push(result);
      console.log("✔ Fixed:", result.file, "issues:", result.issuesFixed.join(", "));
    }
  }

  if (!fixes.length) {
    console.log("✅ No auto-fixable issues found.");
  } else {
    console.log(`🎉 GR3 complete — ${fixes.length} files patched.`);
  }
}

/* ------------------------------------------------------------
   5. START
------------------------------------------------------------ */
runAutoFix();
