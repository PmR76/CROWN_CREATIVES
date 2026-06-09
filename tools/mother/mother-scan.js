#!/usr/bin/env node
// MOTHER — Crown Creatives CSS Intelligence Core (Self‑Healing + Hero Integrity + Mobile Safety)

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

const selectorMap = new Map();
const issues = [];

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
//  SCAN A SINGLE CSS FILE
// ───────────────────────────────────────────────
async function scanFile(filePath) {
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

      // MOBILE SAFETY
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
    }
  });
}

// ───────────────────────────────────────────────
//  MAIN EXECUTION
// ───────────────────────────────────────────────
(async () => {
  console.log("┌───────────────────────────────────────────────┐");
  console.log("│  MOTHER // CROWN CREATIVES CSS DIAGNOSTICS   │");
  console.log("│  STATUS: ONLINE                              │");
  console.log("└───────────────────────────────────────────────┘\n");

  logCRT("SCANNING CSS FILES...");
  for (const file of cssFiles) {
    logCRT(`PARSE: ${path.relative(process.cwd(), file)}`);
    await scanFile(file);
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
    duplicates,
    issues,
    heroStatus
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
  logCRT(`FILES: ${report.filesScanned}`);
  logCRT(`DUPLICATE SELECTORS: ${report.duplicates.length}`);
  logCRT(`ISSUES: ${report.issues.length}`);
  logCRT("");
  logCRT("DETAIL: tools/mother/mother-report.md");
})();

// ───────────────────────────────────────────────
//  MARKDOWN REPORT BUILDER
// ───────────────────────────────────────────────
function buildMarkdownReport(report) {
  let md = "";
  md += "# MOTHER // CSS DIAGNOSTIC REPORT\n\n";
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
    md += "- None detected.\n";
    return md;
  }

  for (const issue of report.issues) {
    md += `- **${issue.type}** — \`${issue.selector}\` in \`${issue.file}\``;

    if (issue.widthVW || issue.heightVH) {
      md += ` (width: ${issue.widthVW || "n/a"}, height: ${issue.heightVH || "n/a"})`;
    }

    if (issue.zIndex) {
      md += ` (z-index: ${issue.zIndex})`;
    }

    if (issue.minWidthPX) {
      md += ` (min-width: ${issue.minWidthPX}px)`;
    }

    if (issue.message) {
      md += ` — ${issue.message}`;
    }

    md += "\n";
  }

  return md;
}
