#!/usr/bin/env node
// MOTHER — Crown Creatives CSS Intelligence Core

import fs from "fs";
import path from "path";
import glob from "glob";
import postcss from "postcss";

const CONFIG_PATH = path.join(process.cwd(), "tools/mother/mother.config.json");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

const cssFiles = glob.sync(config.cssGlobs, { absolute: true });

const selectorMap = new Map();
const issues = [];

function logCRT(line = "") {
  console.log(`▌ ${line}`);
}

async function scanFile(filePath) {
  const css = fs.readFileSync(filePath, "utf8");
  const root = postcss.parse(css);

  root.walkRules(rule => {
    const selector = rule.selector;
    const loc = `${path.relative(process.cwd(), filePath)}`;

    // Track selector definitions
    if (!selectorMap.has(selector)) selectorMap.set(selector, []);
    selectorMap.get(selector).push({ file: loc });

    // Inspect declarations
    let posFixed = false;
    let widthVW = null;
    let heightVH = null;
    let zIndex = null;

    rule.walkDecls(decl => {
      const { prop, value } = decl;

      if (prop === "position" && value === "fixed") posFixed = true;
      if (prop === "width" && value.includes("vw")) widthVW = value;
      if (prop === "height" && value.includes("vh")) heightVH = value;
      if (prop === "z-index") zIndex = parseInt(value, 10);
    });

    // Overflow risk
    if (posFixed && (widthVW || heightVH)) {
      issues.push({
        type: "overflow-risk",
        selector,
        file: loc,
        widthVW,
        heightVH
      });
    }

    // High z-index
    if (zIndex && zIndex > config.zIndexWarnThreshold) {
      issues.push({
        type: "z-index-high",
        selector,
        file: loc,
        zIndex
      });
    }
  });
}

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
    issues
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
  
function buildMarkdownReport(report) {
  let md = "";
  md += "# MOTHER // CSS DIAGNOSTIC REPORT\n\n";
  md += `**Timestamp:** ${report.timestamp}\n\n`;

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

  md += "## Issues\n\n";
  if (!report.issues.length) {
    md += "- None detected.\n";
    return md;
  }

  for (const issue of report.issues) {
    if (issue.type === "overflow-risk") {
      md += `- **Overflow risk** — \`${issue.selector}\` in \`${issue.file}\` `;
      md += `(width: ${issue.widthVW || "n/a"}, height: ${issue.heightVH || "n/a"})\n`;
    } else if (issue.type === "z-index-high") {
      md += `- **High z-index** — \`${issue.selector}\` in \`${issue.file}\` (z-index: ${issue.zIndex})\n`;
    }
  }

  return md;
}
