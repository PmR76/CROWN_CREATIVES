#!/usr/bin/env node
// MOTHER v5 — Hybrid Diagnostic Engine
// Deep scan: header, shimmer, CSS, HTML, JS, hero, z-index, mobile risk.
// Writes: tools/mother/mother-report.json + tools/mother/mother-report.md

import fs from "fs";
import path from "path";
import { glob } from "glob";

const PROJECT_ROOT = process.cwd();
const CONFIG_PATH = path.join(PROJECT_ROOT, "tools/mother/mother.config.json");

// ───────────────────────────────────────────────
// CONFIG
// ───────────────────────────────────────────────
let config = {
  html: { paths: ["*.html"] },
  css: { paths: ["assets/css/**/*.css"] },
  js: { paths: ["assets/js/**/*.js"] },
  zIndexWarnThreshold: 999
};

if (fs.existsSync(CONFIG_PATH)) {
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    config = { ...config, ...raw };
  } catch {
    console.warn("▌ WARN: Failed to parse mother.config.json, using defaults.");
  }
}

const htmlFiles = glob.sync(config.html.paths, { absolute: true });
const cssFiles = glob.sync(config.css.paths, { absolute: true });
const jsFiles = glob.sync(config.js.paths, { absolute: true });

const issues = [];
const fixes = [];
const selectorMap = new Map();

const heroStatus = {
  hasHeroSection: false,
  hasHeroFlex: false,
  hasHeroCrown: false,
  hasGalleryLane: false
};

const LEVEL_ORDER = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFO: 4
};

// ───────────────────────────────────────────────
// UTIL
// ───────────────────────────────────────────────
function log(msg = "") {
  console.log(`▌ ${msg}`);
}

function readSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    issues.push({
      level: "CRITICAL",
      type: "file-missing",
      file: path.relative(PROJECT_ROOT, filePath),
      message: "File missing or unreadable."
    });
    return null;
  }
}

function pushIssue(issue) {
  issues.push(issue);
}

function pushFix(fix) {
  fixes.push(fix);
}

// ───────────────────────────────────────────────
// CHECK 1 — HEADER INTEGRITY
// ───────────────────────────────────────────────
function checkHeader() {
  const headerPath = path.join(PROJECT_ROOT, "master/header.html");
  const rel = path.relative(PROJECT_ROOT, headerPath);
  const html = readSafe(headerPath);
  if (html === null) return;

  if (!html.includes('id="soundToggle"')) {
    pushIssue({
      level: "CRITICAL",
      type: "header-soundToggle-missing",
      file: rel,
      message: "soundToggle ID missing — sound engine cannot bind."
    });
    pushFix({
      file: rel,
      suggestion: "Inject a <img id=\"soundToggle\" ...> icon in the header left block."
    });
  }

  if (!html.includes('id="themeToggle"')) {
    pushIssue({
      level: "CRITICAL",
      type: "header-themeToggle-missing",
      file: rel,
      message: "themeToggle ID missing — theme engine cannot bind."
    });
    pushFix({
      file: rel,
      suggestion: "Inject a <img id=\"themeToggle\" ...> icon in the header right block."
    });
  }

  const crownMatches = html.match(/head-crown\.svg/g) || [];
  if (crownMatches.length > 1) {
    pushIssue({
      level: "HIGH",
      type: "header-multiple-crowns",
      file: rel,
      message: "Multiple crown logos detected — header centering may break."
    });
    pushFix({
      file: rel,
      suggestion: "Keep a single head-crown.svg in the main title block; remove duplicates."
    });
  }
}

// ───────────────────────────────────────────────
// CHECK 2 — SHIMMER CONFLICT (DETECTION ONLY)
// ───────────────────────────────────────────────
function checkShimmer() {
  const globalPath = path.join(PROJECT_ROOT, "assets/css/global.css");
  const rel = path.relative(PROJECT_ROOT, globalPath);
  const css = readSafe(globalPath);
  if (css === null) return;

  const lines = css.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    const isShimmer =
      trimmed.startsWith('img[src*="crown"]') ||
      trimmed.startsWith("img[src*='crown']");

    if (isShimmer && !trimmed.includes(":not(.cc-header-icon)")) {
      pushIssue({
        level: "CRITICAL",
        type: "shimmer-header-conflict",
        file: rel,
        message: "Shimmer selector targets crown images without excluding .cc-header-icon."
      });
      pushFix({
        file: rel,
        suggestion:
          "Change img[src*=\"crown\"] to img[src*=\"crown\"]:not(.cc-header-icon) in shimmer rules."
      });
      break;
    }
  }
}

// ───────────────────────────────────────────────
// CHECK 3 — SCRIPT ORDER ON index.html
// ───────────────────────────────────────────────
function checkScriptOrder() {
  const indexPath = path.join(PROJECT_ROOT, "index.html");
  const rel = path.relative(PROJECT_ROOT, indexPath);
  const html = readSafe(indexPath);
  if (html === null) return;

  const masterPos = html.indexOf("master/js/master.js");
  const soundPos = html.indexOf("assets/js/sound-engine.js");
  const themePos = html.indexOf("assets/js/theme.js");

  if (masterPos === -1 || soundPos === -1 || themePos === -1) {
    pushIssue({
      level: "CRITICAL",
      type: "script-missing",
      file: rel,
      message: "Missing one or more core scripts (master.js, sound-engine.js, theme.js)."
    });
    return;
  }

  if (!(masterPos < soundPos && soundPos < themePos)) {
    pushIssue({
      level: "HIGH",
      type: "script-order",
      file: rel,
      message: "Script order must be master.js → sound-engine.js → theme.js."
    });
    pushFix({
      file: rel,
      suggestion:
        "Reorder <script> tags so master.js loads first, then sound-engine.js, then theme.js."
    });
  }
}

// ───────────────────────────────────────────────
// CHECK 4 — CSS DUPLICATE SELECTORS + HERO STATUS
// ───────────────────────────────────────────────
function checkCss() {

  for (const file of cssFiles) {
    const rel = path.relative(PROJECT_ROOT, file);
    const css = readSafe(file);
    if (css === null) continue;

    const lines = css.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // HERO STATUS DETECTION
      if (trimmed.includes(".hero-section")) heroStatus.hasHeroSection = true;
      if (trimmed.includes(".hero-flex")) heroStatus.hasHeroFlex = true;
      if (trimmed.includes(".hero-crown")) heroStatus.hasHeroCrown = true;
      if (trimmed.includes(".gallery-lane")) heroStatus.hasGalleryLane = true;

      // SAFE SELECTOR EXTRACTION (no regex)
      // Detects selectors like:
      // .class {   #id {   tag {   [attr] {   .class[attr] {
      if (trimmed.endsWith("{")) {
        const selector = trimmed.slice(0, -1).trim(); // remove "{"
        if (selector.length > 0) {
          if (!selectorMap.has(selector)) selectorMap.set(selector, []);
          selectorMap.get(selector).push(rel);
        }
      }

      // Z-INDEX CHECK
      if (trimmed.startsWith("z-index:")) {
        const val = parseInt(trimmed.replace(/[^\d\-]/g, ""), 10);
        if (!Number.isNaN(val) && val > config.zIndexWarnThreshold) {
          pushIssue({
            level: "MEDIUM",
            type: "z-index-high",
            file: rel,
            message: `High z-index (${val}) may conflict with hero/footer layers.`
          });
        }
      }

      // MIN-WIDTH CHECK
      if (trimmed.startsWith("min-width:") && trimmed.includes("px")) {
        const val = parseInt(trimmed.replace(/[^\d]/g, ""), 10);
        if (!Number.isNaN(val) && val > 480) {
          pushIssue({
            level: "MEDIUM",
            type: "mobile-layout-risk",
            file: rel,
            message: `min-width ${val}px may break small phones; wrap in a media query.`
          });
          pushFix({
            file: rel,
            suggestion:
              "Wrap large min-width rules in @media (min-width: 768px) for safer mobile layout."
          });
        }
      }
    }
  }

  // DUPLICATE SELECTOR REPORTING
  for (const [selector, files] of selectorMap.entries()) {
    if (files.length > 1) {
      pushIssue({
        level: "MEDIUM",
        type: "css-duplicate-selector",
        selector,
        files,
        message: "Duplicate CSS selector defined in multiple files."
      });
    }
  }
}

// ───────────────────────────────────────────────
// CHECK 5 — HTML: missing alt + duplicate IDs
// ───────────────────────────────────────────────
function checkHtml() {
  for (const file of htmlFiles) {
    const rel = path.relative(PROJECT_ROOT, file);
    const html = readSafe(file);
    if (html === null) continue;

    const imgMatches = html.match(/<img[^>]*>/g) || [];
    for (const tag of imgMatches) {
      if (!/alt="/.test(tag)) {
        pushIssue({
          level: "LOW",
          type: "html-img-no-alt",
          file: rel,
          message: "Image tag missing alt attribute."
        });
      }
    }

    const idMatches = [...html.matchAll(/id="([^"]+)"/g)];
    const idMap = new Map();
    for (const m of idMatches) {
      const id = m[1];
      idMap.set(id, (idMap.get(id) || 0) + 1);
    }
    for (const [id, count] of idMap.entries()) {
      if (count > 1) {
        pushIssue({
          level: "HIGH",
          type: "html-duplicate-id",
          file: rel,
          id,
          message: `Duplicate id "${id}" (${count} occurrences).`
        });
      }
    }
  }
}

// ───────────────────────────────────────────────
// CHECK 6 — JS: selector usage (for cross‑ref)
// ───────────────────────────────────────────────
function checkJs() {
  for (const file of jsFiles) {
    const rel = path.relative(PROJECT_ROOT, file);
    const js = readSafe(file);
    if (js === null) continue;

    const selectorMatches = [...js.matchAll(/querySelector(All)?\("([^"]+)"\)/g)];
    for (const m of selectorMatches) {
      const selector = m[2];
      pushIssue({
        level: "INFO",
        type: "js-selector-usage",
        file: rel,
        selector,
        message: "JS uses this selector; ensure it exists in HTML/CSS."
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

log("Scanning header...");
checkHeader();

log("Scanning shimmer system...");
checkShimmer();

log("Scanning CSS...");
checkCss();

log("Scanning HTML...");
checkHtml();

log("Scanning JS...");
checkJs();

// hero integrity summary
if (!heroStatus.hasHeroSection ||
    !heroStatus.hasHeroFlex ||
    !heroStatus.hasHeroCrown ||
    !heroStatus.hasGalleryLane) {
  pushIssue({
    level: "HIGH",
    type: "hero-incomplete",
    file: "assets/css/* / layout",
    message:
      "Hero stack incomplete. Check .hero-section, .hero-flex, .hero-crown, .gallery-lane."
  });
}

// sort issues by severity for “appropriate order”
issues.sort((a, b) => {
  const la = LEVEL_ORDER[a.level] ?? 99;
  const lb = LEVEL_ORDER[b.level] ?? 99;
  if (la !== lb) return la - lb;
  return (a.type || "").localeCompare(b.type || "");
});

// build report
const report = {
  timestamp: new Date().toISOString(),
  htmlFilesScanned: htmlFiles.length,
  cssFilesScanned: cssFiles.length,
  jsFilesScanned: jsFiles.length,
  heroStatus,
  issues,
  fixes
};

const REPORT_JSON = path.join(PROJECT_ROOT, "tools/mother/mother-report.json");
const REPORT_MD = path.join(PROJECT_ROOT, "tools/mother/mother-report.md");

fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");

// markdown
let md = "";
md += "# MOTHER v5 // OPS DIAGNOSTIC REPORT\n\n";
md += `**Timestamp:** ${report.timestamp}\n\n`;
md += `Scanned: ${report.htmlFilesScanned} HTML, ${report.cssFilesScanned} CSS, ${report.jsFilesScanned} JS files.\n\n`;

md += "## Hero integrity\n\n";
if (!heroStatus.hasHeroSection ||
    !heroStatus.hasHeroFlex ||
    !heroStatus.hasHeroCrown ||
    !heroStatus.hasGalleryLane) {
  md += "- **Warning:** Hero stack incomplete. Check `.hero-section`, `.hero-flex`, `.hero-crown`, `.gallery-lane`.\n\n";
} else {
  md += "- Hero stack detected and structurally complete.\n\n";
}

md += "## Issues (ordered by severity)\n\n";
if (!issues.length) {
  md += "- None detected.\n\n";
} else {
  for (const issue of issues) {
    md += `- **${issue.level}** — **${issue.type}**`;
    if (issue.file) md += ` in \`${issue.file}\``;
    if (issue.selector) md += ` — selector: \`${issue.selector}\``;
    if (issue.id) md += ` — id: \`${issue.id}\``;
    md += ` — ${issue.message}\n`;
  }
  md += "\n";
}

md += "## Suggested fixes\n\n";
if (!fixes.length) {
  md += "- None generated.\n";
} else {
  for (const fix of fixes) {
    md += `- \`${fix.file}\` — ${fix.suggestion}\n`;
  }
}

fs.writeFileSync(REPORT_MD, md, "utf8");

log("");
log("SCAN COMPLETE.");
log(`ISSUES FOUND: ${issues.length}`);
log(`DETAIL: tools/mother/mother-report.md`);
log("Use mother-fix.js to auto-apply safe fixes.");
