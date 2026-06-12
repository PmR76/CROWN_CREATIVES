#!/usr/bin/env node
// MOTHER v5 — Crown Creatives Hybrid Diagnostic Engine
// Focused on: Header integrity, shimmer conflicts, script order,
// missing files, duplicate selectors, duplicate IDs, missing alt tags,
// broken references, and page engine validation.

import fs from "fs";
import path from "path";
import { glob } from "glob";

// ───────────────────────────────────────────────
// CONFIG LOAD
// ───────────────────────────────────────────────
const CONFIG_PATH = path.join(process.cwd(), "tools/mother/mother.config.json");

if (!fs.existsSync(CONFIG_PATH)) {
  console.error("ERROR: mother.config.json not found.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

// Resolve globs safely
const htmlFiles = glob.sync(config.html.paths, { absolute: true });
const cssFiles = glob.sync(config.css.paths, { absolute: true });
const jsFiles = glob.sync(config.js.paths, { absolute: true });

const issues = [];
const fixes = [];
const selectorMap = new Map();

// ───────────────────────────────────────────────
// UTIL
// ───────────────────────────────────────────────
function readSafe(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    issues.push({
      level: "CRITICAL",
      file,
      message: "File missing or unreadable."
    });
    return "";
  }
}

function log(msg = "") {
  console.log(`▌ ${msg}`);
}

// ───────────────────────────────────────────────
// CHECK 1 — HEADER INTEGRITY
// ───────────────────────────────────────────────
function checkHeader() {
  const headerPath = path.join(process.cwd(), "master/header.html");

  if (!fs.existsSync(headerPath)) {
    issues.push({
      level: "CRITICAL",
      file: "master/header.html",
      message: "Header file missing."
    });
    return;
  }

  const html = readSafe(headerPath);

  if (!html.includes('id="soundToggle"')) {
    issues.push({
      level: "CRITICAL",
      file: "master/header.html",
      message: "soundToggle ID missing — sound engine cannot bind."
    });
  }

  if (!html.includes('id="themeToggle"')) {
    issues.push({
      level: "CRITICAL",
      file: "master/header.html",
      message: "themeToggle ID missing — theme engine cannot bind."
    });
  }

  const crownCount = (html.match(/head-crown/g) || []).length;
  if (crownCount > 1) {
    issues.push({
      level: "HIGH",
      file: "master/header.html",
      message: "Multiple crown logos detected — header cannot center correctly."
    });
  }
}

// ───────────────────────────────────────────────
// CHECK 2 — SHIMMER CONFLICTS
// ───────────────────────────────────────────────
function checkShimmer() {
  const globalCssPath = path.join(process.cwd(), "assets/css/global.css");

  if (!fs.existsSync(globalCssPath)) {
    issues.push({
      level: "CRITICAL",
      file: "assets/css/global.css",
      message: "global.css missing."
    });
    return;
  }

  const css = readSafe(globalCssPath);

  if (css.includes('img[src*="crown"]') &&
      !css.includes(':not(.cc-header-icon)')) {
    issues.push({
      level: "CRITICAL",
      file: "assets/css/global.css",
      message: "Shimmer system applies to header icons — must exclude .cc-header-icon."
    });

    fixes.push({
      file: "assets/css/global.css",
      suggestion: "Add :not(.cc-header-icon) to shimmer selectors."
    });
  }
}

// ───────────────────────────────────────────────
// CHECK 3 — SCRIPT ORDER
// ───────────────────────────────────────────────
function checkScriptOrder() {
  const indexPath = path.join(process.cwd(), "index.html");

  if (!fs.existsSync(indexPath)) {
    issues.push({
      level: "CRITICAL",
      file: "index.html",
      message: "index.html missing."
    });
    return;
  }

  const html = readSafe(indexPath);

  const masterPos = html.indexOf("master/js/master.js");
  const soundPos = html.indexOf("assets/js/sound-engine.js");
  const themePos = html.indexOf("assets/js/theme.js");

  if (masterPos === -1 || soundPos === -1 || themePos === -1) {
    issues.push({
      level: "CRITICAL",
      file: "index.html",
      message: "Missing core scripts (master.js, sound-engine.js, theme.js)."
    });
    return;
  }

  if (!(masterPos < soundPos && soundPos < themePos)) {
    issues.push({
      level: "HIGH",
      file: "index.html",
      message: "Incorrect script order — must be master.js → sound-engine.js → theme.js."
    });
  }
}

// ───────────────────────────────────────────────
// CHECK 4 — CSS DUPLICATE SELECTORS
// ───────────────────────────────────────────────
function checkCssDuplicates() {
  for (const file of cssFiles) {
    const css = readSafe(file);
    const lines = css.split("\n");

    for (const line of lines) {
const selectorRegex = new RegExp("^([.#a-zA-Z0-9_\\-\
\
\[\\]\
\
=\\*]+)\\s*\\{");
const match = line.match(selectorRegex);

      if (match) {
        const sel = match[1];
        if (!selectorMap.has(sel)) selectorMap.set(sel, []);
        selectorMap.get(sel).push(file);
      }
    }
  }

  for (const [selector, files] of selectorMap.entries()) {
    if (files.length > 1) {
      issues.push({
        level: "MEDIUM",
        selector,
        files,
        message: "Duplicate CSS selector detected."
      });
    }
  }
}

// ───────────────────────────────────────────────
// CHECK 5 — HTML DUPLICATE IDs + MISSING ALT
// ───────────────────────────────────────────────
function checkHtmlIntegrity() {
  for (const file of htmlFiles) {
    const html = readSafe(file);

    // Missing alt
    const imgs = [...html.matchAll(/<img[^>]*>/g)];
    for (const tag of imgs) {
      if (!/alt="/.test(tag[0])) {
        issues.push({
          level: "LOW",
          file,
          message: "Image missing alt attribute."
        });
      }
    }

    // Duplicate IDs
    const ids = [...html.matchAll(/id="([^"]+)"/g)];
    const map = new Map();
    for (const m of ids) {
      const id = m[1];
      map.set(id, (map.get(id) || 0) + 1);
    }
    for (const [id, count] of map.entries()) {
      if (count > 1) {
        issues.push({
          level: "HIGH",
          file,
          id,
          message: `Duplicate ID (${count} occurrences).`
        });
      }
    }
  }
}

// ───────────────────────────────────────────────
// CHECK 6 — JS PAGE ENGINE VALIDATION
// ───────────────────────────────────────────────
function checkPageEngines() {
  const pages = [
    "home",
    "about",
    "gallery",
    "projects",
    "videos",
    "podcasts",
    "blog",
    "contact"
  ];

  for (const page of pages) {
    const jsPath = path.join(process.cwd(), `assets/js/${page}.js`);
    if (!fs.existsSync(jsPath)) {
      issues.push({
        level: "LOW",
        file: jsPath,
        message: "Page engine missing (may be intentional)."
      });
    }
  }
}

// ───────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────
console.log("┌───────────────────────────────────────────────┐");
console.log("│  MOTHER v5 // HYBRID DIAGNOSTIC ENGINE        │");
console.log("│  STATUS: ONLINE                               │");
console.log("└───────────────────────────────────────────────┘\n");

log("Checking header integrity...");
checkHeader();

log("Checking shimmer conflicts...");
checkShimmer();

log("Checking script order...");
checkScriptOrder();

log("Checking CSS duplicates...");
checkCssDuplicates();

log("Checking HTML integrity...");
checkHtmlIntegrity();

log("Checking page engines...");
checkPageEngines();

// ───────────────────────────────────────────────
// REPORT OUTPUT
// ───────────────────────────────────────────────
const report = {
  timestamp: new Date().toISOString(),
  issues,
  fixes
};

fs.writeFileSync(
  "tools/mother/mother-report.json",
  JSON.stringify(report, null, 2),
  "utf8"
);

let md = `# MOTHER v5 Diagnostic Report\n\n`;
md += `**Timestamp:** ${report.timestamp}\n\n`;

if (issues.length === 0) {
  md += "System Status: **OK** — No issues detected.\n";
} else {
  md += `System Status: **${issues.length} issues detected**\n\n`;
  for (const issue of issues) {
    md += `- **${issue.level}** — ${issue.message}`;
    if (issue.file) md += ` (in \`${issue.file}\`)`;
    if (issue.selector) md += ` — selector: \`${issue.selector}\``;
    md += "\n";
  }
}

if (fixes.length > 0) {
  md += `\n## Suggested Fixes\n\n`;
  for (const fix of fixes) {
    md += `- **${fix.file}** — ${fix.suggestion}\n`;
  }
}

fs.writeFileSync("tools/mother/mother-report.md", md, "utf8");

log("");
log("SCAN COMPLETE.");
log(`ISSUES FOUND: ${issues.length}`);
log("See: tools/mother/mother-report.md");
