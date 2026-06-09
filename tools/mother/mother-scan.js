#!/usr/bin/env node
// MOTHER v3 — Crown Creatives OPS Core
// CSS + Hero Integrity + Mobile Safety + HTML/JS/Asset Scan + Fix Suggestions

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ───────────────────────────────────────────────
//  SELF‑HEALING DEPENDENCY LOADER
// ───────────────────────────────────────────────
async function ensureModule(pkg) {
  try {
    return await import(pkg);
  } catch {
    console.log(`▌ >> DEPENDENCY MISSING: ${pkg}`);
    console.log("▌ >> INITIATING SELF‑REPAIR...");
    execSync(`npm install ${pkg}`, { stdio: "inherit" });
    return await import(pkg);
  }
}

const [{ glob }, postcssModule] = await Promise.all([
  ensureModule("glob"),
  ensureModule("postcss")
]);

const postcss = postcssModule.default || postcssModule;

// ───────────────────────────────────────────────
//  LOAD CONFIG
// ───────────────────────────────────────────────
const CONFIG_PATH = path.join(process.cwd(), "tools/mother/mother.config.json");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

const cssFiles = glob.sync(config.cssGlobs, { absolute: true });
const htmlFiles = glob.sync(config.htmlGlobs || ["*.html"], { absolute: true });
const jsFiles = glob.sync(config.jsGlobs || ["assets/js/**/*.js"], { absolute: true });

const selectorMap = new Map();
const issues = [];
const fixSuggestions = [];

// HERO INTEGRITY STATUS
const heroStatus = {
  hasHeroSection: false,
  hasHeroFlex: false,
  hasHeroCrown: false,
  hasGalleryLane: false
};

// ───────────────────────────────────────────────
//  CRT LOGGING
// ───────────────────────────────────────────────
function logCRT(line = "") {
  console.log(`▌ ${line}`);
}

// ───────────────────────────────────────────────
//  CSS SCAN
// ───────────────────────────────────────────────
async function scanCssFile(filePath) {
  const css = fs.readFileSync(filePath, "utf8");
  const root = postcss.parse(css);

  root.walkRules(rule => {
    const selector = rule.selector;
    const loc = `${path.relative(process.cwd(), filePath)}`;

    // Track selector definitions
    if (!selectorMap.has(selector)) selectorMap.set(selector, []);
    selectorMap.get(selector).push({ file: loc });

    // HERO INTEGRITY DETECTION
    if (selector.includes(".hero-section")) heroStatus.hasHeroSection = true;
    if (selector.includes(".hero-flex")) heroStatus.hasHeroFlex = true;
    if (selector.includes(".hero-crown")) heroStatus.hasHeroCrown = true;
    if (selector.includes(".gallery-lane")) heroStatus.hasGalleryLane = true;

    // Inspect declarations
    let posFixed = false;
    let widthVW = null;
    let heightVH = null;
    let zIndex = null;
    let overflowX = null;
    let overflowY = null;
    let minWidthPX = null;

    rule.walkDecls(decl => {
      const { prop, value } = decl;

      if (prop === "position" && value === "fixed") posFixed = true;
      if (prop === "width" && value.includes("vw")) widthVW = value;
      if (prop === "height" && value.includes("vh")) heightVH = value;
      if (prop === "z-index") zIndex = parseInt(value, 10);
      if (prop === "overflow-x") overflowX = value;
      if (prop === "overflow-y") overflowY = value;

      if (prop === "min-width" && value.endsWith("px")) {
        minWidthPX = parseInt(value, 10);
      }
    });

    // Overflow risk
    if (posFixed && (widthVW || heightVH)) {
      issues.push({
        type: "overflow-risk",
        selector,
        file: loc,
        widthVW,
        heightVH,
        message: "Fixed element with viewport-relative size may cause horizontal/vertical scroll."
      });

      fixSuggestions.push({
        selector,
        file: loc,
        suggestion: "Reduce width/height to 100vw/100vh and use transform: scale(...) for cinematic oversize."
      });
    }

    // Global overflow safety
    if ((selector === "body" || selector === "html") &&
        (overflowX !== "hidden" && overflowY !== "hidden")) {
      issues.push({
        type: "global-overflow",
        selector,
        file: loc,
        message: "Consider overflow-x: hidden to prevent cinematic layers from leaking."
      });

      fixSuggestions.push({
        selector,
        file: loc,
        suggestion: "Add: overflow-x: hidden; to body/html to prevent horizontal scroll."
      });
    }

    // High z-index
    if (zIndex && zIndex > config.zIndexWarnThreshold) {
      issues.push({
        type: "z-index-high",
        selector,
        file: loc,
        zIndex,
        message: "High z-index may cause layering conflicts with hero/footer."
      });

      fixSuggestions.push({
        selector,
        file: loc,
        suggestion: `Consider reducing z-index below ${config.zIndexWarnThreshold} or documenting intentional overlay.`
      });
    }

    // MOBILE LAYOUT RISK
    if (minWidthPX && minWidthPX > 480) {
      issues.push({
        type: "mobile-layout-risk",
        selector,
        file: loc,
        minWidthPX,
        message: "Min-width above 480px may break small phones."
      });

      fixSuggestions.push({
        selector,
        file: loc,
        suggestion: "Wrap large min-width rules in a media query (min-width: 768px) for safer mobile behaviour."
      });
    }
  });
}

// ───────────────────────────────────────────────
//  HTML SCAN (basic integrity)
// ───────────────────────────────────────────────
function scanHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const loc = `${path.relative(process.cwd(), filePath)}`;

  // Very simple checks: missing alt on img, duplicate ids
  const imgMatches = [...html.matchAll(/<img[^>]*>/g)];
  imgMatches.forEach(match => {
    const tag = match[0];
    if (!/alt="/.test(tag)) {
      issues.push({
        type: "html-img-no-alt",
        file: loc,
        snippet: tag,
        message: "Image tag missing alt attribute."
      });
    }
  });

  const idMatches = [...html.matchAll(/id="([^"]+)"/g)];
  const idMap = new Map();
  idMatches.forEach(m => {
    const id = m[1];
    if (!idMap.has(id)) idMap.set(id, 0);
    idMap.set(id, idMap.get(id) + 1);
  });
  for (const [id, count] of idMap.entries()) {
    if (count > 1) {
      issues.push({
        type: "html-duplicate-id",
        file: loc,
        id,
        count,
        message: "Duplicate id in HTML can cause JS/anchor conflicts."
      });
    }
  }
}

// ───────────────────────────────────────────────
//  JS SCAN (basic integrity)
// ───────────────────────────────────────────────
function scanJsFile(filePath) {
  const js = fs.readFileSync(filePath, "utf8");
  const loc = `${path.relative(process.cwd(), filePath)}`;

  // Simple check: querySelector targets that don't exist in HTML (approximate)
  const selectorMatches = [...js.matchAll(/querySelector(All)?\("([^"]+)"\)/g)];
  selectorMatches.forEach(m => {
    const selector = m[2];
    // We don't fully validate here, just record usage for future cross-check
    issues.push({
      type: "js-selector-usage",
      file: loc,
      selector,
      message: "JS uses this selector; ensure it exists in HTML."
    });
  });
}

// ───────────────────────────────────────────────
//  MAIN EXECUTION
// ───────────────────────────────────────────────
(async () => {
  console.log("┌───────────────────────────────────────────────┐");
  console.log("│  MOTHER // CROWN CREATIVES OPS DIAGNOSTICS   │");
  console.log("│  STATUS: ONLINE                              │");
  console.log("└───────────────────────────────────────────────┘\n");

  logCRT("SCANNING CSS FILES...");
  for (const file of cssFiles) {
    logCRT(`PARSE: ${path.relative(process.cwd(), file)}`);
    await scanCssFile(file);
  }

  logCRT("");
  logCRT("SCANNING HTML FILES...");
  for (const file of htmlFiles) {
    logCRT(`PARSE: ${path.relative(process.cwd(), file)}`);
    scanHtmlFile(file);
  }

  logCRT("");
  logCRT("SCANNING JS FILES...");
  for (const file of jsFiles) {
    logCRT(`PARSE: ${path.relative(process.cwd(), file)}`);
    scanJsFile(file);
  }

  // Duplicate selectors
  const duplicates = [];
  for (const [selector, defs] of selectorMap.entries()) {
    if (defs.length > 1) {
      duplicates.push({ selector, defs });
    }
  }

  // Build report object
  const report = {
    timestamp: new Date().toISOString(),
    filesScanned: cssFiles.length,
    htmlFilesScanned: htmlFiles.length,
    jsFilesScanned: jsFiles.length,
    duplicates,
    issues,
    heroStatus,
    fixSuggestions
  };

  // Write JSON
  const outJson = path.join(process.cwd(), "tools/mother/mother-report.json");
  fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");

  // Write Markdown
  const outMd = path.join(process.cwd(), "tools/mother/mother-report.md");
  const md = buildMarkdownReport(report);
  fs.writeFileSync(outMd, md, "utf8");

  // Terminal summary
  logCRT("");
  logCRT("SCAN COMPLETE.");
  logCRT(`CSS FILES: ${report.filesScanned}`);
  logCRT(`HTML FILES: ${report.htmlFilesScanned}`);
  logCRT(`JS FILES: ${report.jsFilesScanned}`);
  logCRT(`DUPLICATE SELECTORS: ${report.duplicates.length}`);
  logCRT(`ISSUES: ${report.issues.length}`);
  logCRT(`FIX SUGGESTIONS: ${report.fixSuggestions.length}`);
  logCRT("");
  logCRT("DETAIL: tools/mother/mother-report.md");
})();

// ───────────────────────────────────────────────
//  MARKDOWN REPORT BUILDER
// ───────────────────────────────────────────────
function buildMarkdownReport(report) {
  let md = "";
  md += "# MOTHER // OPS DIAGNOSTIC REPORT\n\n";
  md += `**Timestamp:** ${report.timestamp}\n\n`;

  // HERO INTEGRITY
  md += "## Hero integrity\n\n";
  const h = report.heroStatus;

  if (!h.hasHeroSection || !h.hasHeroFlex || !h.hasHeroCrown || !h.hasGalleryLane) {
    md += "- **Warning:** Hero stack incomplete. Check `.hero-section`, `.hero-flex`, `.hero-crown`, `.gallery-lane`.\n\n";
  } else {
    md += "- Hero stack detected and structurally complete.\n\n";
  }

  // DUPLICATES
  md += "## Duplicate selectors\n\n";
  if (!report.duplicates.length) {
    md += "- None detected.\n\n";
  } else {
    for (const dup of report.duplicates) {
      md += `- \`${dup.selector}\`\n`;
      dup.defs.forEach(d => {
        md += `  - ${d.file}\n`;
      });
    }
    md += "\n";
  }

  // ISSUES
  md += "## Issues\n\n";
  if (!report.issues.length) {
    md += "- None detected.\n\n";
  } else {
    for (const issue of report.issues) {
      md += `- **${issue.type}** — `;
      if (issue.selector) md += `\`${issue.selector}\` `;
      if (issue.file) md += `in \`${issue.file}\``;

      if (issue.widthVW || issue.heightVH) {
        md += ` (width: ${issue.widthVW || "n/a"}, height: ${issue.heightVH || "n/a"})`;
      }

      if (issue.zIndex) {
        md += ` (z-index: ${issue.zIndex})`;
      }

      if (issue.minWidthPX) {
        md += ` (min-width: ${issue.minWidthPX}px)`;
      }

      if (issue.id) {
        md += ` (id: ${issue.id}, count: ${issue.count})`;
      }

      if (issue.snippet) {
        md += ` — snippet: \`${issue.snippet}\``;
      }

      if (issue.message) {
        md += ` — ${issue.message}`;
      }

      md += "\n";
    }
    md += "\n";
  }

  // FIX SUGGESTIONS
  md += "## Fix suggestions\n\n";
  if (!report.fixSuggestions.length) {
    md += "- None generated.\n";
  } else {
    for (const fix of report.fixSuggestions) {
      md += `- \`${fix.selector}\` in \`${fix.file}\` — ${fix.suggestion}\n`;
    }
  }

  return md;
}
