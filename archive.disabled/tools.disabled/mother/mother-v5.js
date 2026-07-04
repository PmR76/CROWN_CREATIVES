#!/usr/bin/env node
// MOTHER v5 — Unified Hybrid Diagnostic + Auto-Fix Engine
// Scan + ordered issues + optional auto-fix (--fix)

import fs from "fs";
import path from "path";
import { glob } from "glob";

const PROJECT_ROOT = process.cwd();
const CONFIG_PATH = path.join(PROJECT_ROOT, "tools/mother/mother.config.json");
const REPORT_JSON = path.join(PROJECT_ROOT, "tools/mother/mother-report.json");
const REPORT_MD = path.join(PROJECT_ROOT, "tools/mother/mother-report.md");

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

function writeSafe(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    log(`✔ Updated: ${path.relative(PROJECT_ROOT, filePath)}`);
  } catch (e) {
    log(`!! Failed to write: ${path.relative(PROJECT_ROOT, filePath)} — ${e.message}`);
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
      kind: "header-soundToggle",
      file: rel
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
      kind: "header-themeToggle",
      file: rel
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
      kind: "header-crown-dedupe",
      file: rel
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
        kind: "shimmer-exclude-header-icon",
        file: rel
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
      kind: "script-order",
      file: rel
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

      if (trimmed.includes(".hero-section")) heroStatus.hasHeroSection = true;
      if (trimmed.includes(".hero-flex")) heroStatus.hasHeroFlex = true;
      if (trimmed.includes(".hero-crown")) heroStatus.hasHeroCrown = true;
      if (trimmed.includes(".gallery-lane")) heroStatus.hasGalleryLane = true;

      if (trimmed.endsWith("{")) {
        const selector = trimmed.slice(0, -1).trim();
        if (selector.length > 0) {
          if (!selectorMap.has(selector)) selectorMap.set(selector, []);
          selectorMap.get(selector).push(rel);
        }
      }

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
            kind: "css-min-width-media",
            file: rel
          });
        }
      }
    }
  }

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
// CHECK 6 — JS: selector usage
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
// AUTO-FIX IMPLEMENTATIONS
// ───────────────────────────────────────────────
function applyFix_header() {
  const headerPath = path.join(PROJECT_ROOT, "master/header.html");
  let html = readSafe(headerPath);
  if (html === null) return;

  let changed = false;

  if (!html.includes('id="soundToggle"')) {
    const block = `
  <!-- LEFT ICON: MUSIC -->
  <div id="cc-header-left">
    <img id="soundToggle"
         class="cc-header-icon"
         src="/assets/icons/music.png"
         alt="Sound Toggle">
  </div>
`;
    if (!html.includes("cc-header-left")) {
      html = html.replace(
        '<div class="cc-header-inner">',
        '<div class="cc-header-inner">\n' + block.trim() + "\n"
      );
      changed = true;
      log("Fix: Injected soundToggle block into master/header.html");
    }
  }

  if (!html.includes('id="themeToggle"')) {
    const block = `
  <!-- RIGHT ICON: THEME -->
  <div id="cc-header-right">
    <img id="themeToggle"
         class="cc-header-icon"
         src="/assets/icons/sun-moon.png"
         alt="Theme Toggle">
  </div>
`;
    if (!html.includes("cc-header-right")) {
      const marker = "</div>";
      const idx = html.lastIndexOf(marker);
      if (idx !== -1) {
        html =
          html.slice(0, idx) +
          "\n" +
          block.trim() +
          "\n" +
          html.slice(idx);
        changed = true;
        log("Fix: Injected themeToggle block into master/header.html");
      }
    }
  }

  const crownPattern = /<img[^>]*head-crown\.svg[^>]*>/g;
  const crowns = html.match(crownPattern) || [];
  if (crowns.length > 1) {
    let firstKept = false;
    html = html.replace(crownPattern, match => {
      if (!firstKept) {
        firstKept = true;
        return match;
      }
      return "";
    });
    changed = true;
    log("Fix: Reduced duplicate crown logos in master/header.html");
  }

  if (changed) {
    writeSafe(headerPath, html);
  } else {
    log("Header: no changes applied (already OK).");
  }
}

function applyFix_shimmer() {
  const globalPath = path.join(PROJECT_ROOT, "assets/css/global.css");
  let css = readSafe(globalPath);
  if (css === null) return;

  let changed = false;

  const lines = css.split("\n");
  const newLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    const isShimmer =
      trimmed.startsWith('img[src*="crown"]') ||
      trimmed.startsWith("img[src*='crown']");

    if (isShimmer && !trimmed.includes(":not(.cc-header-icon)")) {
      line = line.replace(
        'img[src*="crown"]',
        'img[src*="crown"]:not(.cc-header-icon)'
      );
      line = line.replace(
        "img[src*='crown']",
        "img[src*='crown']:not(.cc-header-icon)"
      );
      changed = true;
      log("Fix: Updated shimmer selector to exclude .cc-header-icon in global.css");
    }

    newLines.push(line);
  }

  if (changed) {
    css = newLines.join("\n");
    writeSafe(globalPath, css);
  } else {
    log("Shimmer: no changes applied (already OK or no matching rules).");
  }
}

function applyFix_headerCss() {
  const headerCssPath = path.join(PROJECT_ROOT, "assets/css/header.css");
  let css = readSafe(headerCssPath);
  if (css === null) return;

  let changed = false;

  if (!/\.cc-header-inner\s*\{[^}]*flex-direction:\s*column/.test(css)) {
    css = css.replace(
      /\.cc-header-inner\s*\{[^}]*\}/,
      `.cc-header-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}`
    );
    changed = true;
    log("Fix: Normalised .cc-header-inner to centered column layout in header.css");
  }

  if (!/\.cc-title-block\s*\{[^}]*text-align:\s*center/.test(css)) {
    css += `

.cc-title-block {
  text-align: center;
  margin: 0 auto;
}
`;
    changed = true;
    log("Fix: Added .cc-title-block centering rules to header.css");
  }

  if (!/#cc-header-left\s*\{[^}]*position:\s*absolute/.test(css)) {
    css += `

#cc-header-left,
#cc-header-right {
  position: absolute;
  top: 18px;
  z-index: 999;
}

#cc-header-left {
  left: 25px;
}

#cc-header-right {
  right: 25px;
}
`;
    changed = true;
    log("Fix: Reinforced header icon positioning in header.css");
  }

  if (changed) {
    writeSafe(headerCssPath, css);
  } else {
    log("header.css: no changes applied (already OK).");
  }
}

// script order fix is project-specific; we only log suggestion for now
function applyFix_scriptOrder() {
  log("Script order fix: manual adjustment recommended (see report).");
}

// min-width fix is also manual suggestion
function applyFix_minWidth() {
  log("min-width fix: wrap large min-width rules in media queries (see report).");
}

// ───────────────────────────────────────────────
// SCAN FLOW
// ───────────────────────────────────────────────
function runScan() {
  console.log("┌───────────────────────────────────────────────┐");
  console.log("│  MOTHER v5 // UNIFIED HYBRID ENGINE           │");
  console.log("│  MODE: SCAN                                   │");
  console.log("└───────────────────────────────────────────────┘\n");

  log("Scanning header...");
  checkHeader();

  log("Scanning shimmer system...");
  checkShimmer();

  log("Scanning script order...");
  checkScriptOrder();

  log("Scanning CSS...");
  checkCss();

  log("Scanning HTML...");
  checkHtml();

  log("Scanning JS...");
  checkJs();

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

  issues.sort((a, b) => {
    const la = LEVEL_ORDER[a.level] ?? 99;
    const lb = LEVEL_ORDER[b.level] ?? 99;
    if (la !== lb) return la - lb;
    return (a.type || "").localeCompare(b.type || "");
  });

  const report = {
    timestamp: new Date().toISOString(),
    htmlFilesScanned: htmlFiles.length,
    cssFilesScanned: cssFiles.length,
    jsFilesScanned: jsFiles.length,
    heroStatus,
    issues,
    fixes
  };

  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");

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
      md += `- \`${fix.file}\` — ${fix.kind}\n`;
    }
  }

  fs.writeFileSync(REPORT_MD, md, "utf8");

  log("");
  log("SCAN COMPLETE.");
  log(`ISSUES FOUND: ${issues.length}`);
  log(`DETAIL: tools/mother/mother-report.md`);
}

// ───────────────────────────────────────────────
// AUTO-FIX FLOW
// ───────────────────────────────────────────────
function runFix() {
  console.log("┌───────────────────────────────────────────────┐");
  console.log("│  MOTHER v5 // UNIFIED HYBRID ENGINE           │");
  console.log("│  MODE: AUTO-FIX                               │");
  console.log("└───────────────────────────────────────────────┘\n");

  // We re-scan to ensure fixes are based on current state
  runScan();

  log("\nStarting auto-fix pass...\n");

  applyFix_header();
  applyFix_shimmer();
  applyFix_headerCss();
  applyFix_scriptOrder();
  applyFix_minWidth();

  log("\nAUTO-FIX COMPLETE.");
  log("Re-run without --fix to verify clean state.");
}

// ───────────────────────────────────────────────
// ENTRYPOINT
// ───────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.includes("--fix")) {
  runFix();
} else {
  runScan();
}
