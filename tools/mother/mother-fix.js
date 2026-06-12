#!/usr/bin/env node
// MOTHER v5 — Auto-Fix Engine
// Reads tools/mother/mother-report.json and applies safe, targeted fixes
// to header, shimmer, and basic integrity issues.

import fs from "fs";
import path from "path";

const PROJECT_ROOT = process.cwd();
const REPORT_PATH = path.join(PROJECT_ROOT, "tools/mother/mother-report.json");

function log(msg = "") {
  console.log(`▌ ${msg}`);
}

function readSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    log(`!! Cannot read: ${filePath}`);
    return null;
  }
}

function writeSafe(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    log(`✔ Updated: ${filePath}`);
  } catch (e) {
    log(`!! Failed to write: ${filePath} — ${e.message}`);
  }
}

// ───────────────────────────────────────────────
// LOAD REPORT
// ───────────────────────────────────────────────
if (!fs.existsSync(REPORT_PATH)) {
  console.error("ERROR: tools/mother/mother-report.json not found. Run mother-scan first.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
const issues = report.issues || [];

console.log("┌───────────────────────────────────────────────┐");
console.log("│  MOTHER v5 // AUTO-FIX ENGINE                 │");
console.log("│  STATUS: ONLINE                               │");
console.log("└───────────────────────────────────────────────┘\n");

log(`Loaded ${issues.length} issues from mother-report.json`);

// ───────────────────────────────────────────────
// FIX 1 — Header: ensure soundToggle + themeToggle + single crown
// ───────────────────────────────────────────────
function fixHeader() {
  const headerPath = path.join(PROJECT_ROOT, "master/header.html");
  let html = readSafe(headerPath);
  if (html === null) return;

  let changed = false;

  // Ensure soundToggle exists
  if (!html.includes('id="soundToggle"')) {
    const leftIconBlock = `
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
        '<div class="cc-header-inner">\n' + leftIconBlock.trim() + "\n"
      );
      changed = true;
      log("Fix: Injected soundToggle block into master/header.html");
    }
  }

  // Ensure themeToggle exists
  if (!html.includes('id="themeToggle"')) {
    const rightIconBlock = `
  <!-- RIGHT ICON: THEME -->
  <div id="cc-header-right">
    <img id="themeToggle"
         class="cc-header-icon"
         src="/assets/icons/sun-moon.png"
         alt="Theme Toggle">
  </div>
`;
    if (!html.includes("cc-header-right")) {
      html = html.replace(
        '</div>\n',
        rightIconBlock.trim() + "\n\n</div>\n"
      );
      changed = true;
      log("Fix: Injected themeToggle block into master/header.html");
    }
  }

  // Reduce duplicate crown logos: keep one in cc-title-block
  const crownPattern = /<img[^>]*head-crown\.svg[^>]*>/g;
  const crowns = html.match(crownPattern) || [];
  if (crowns.length > 1) {
    // Keep the first occurrence inside cc-title-block, remove others
    let firstKept = false;
    html = html.replace(crownPattern, match => {
      if (!firstKept && match.includes("cc-logo shimmer-crown")) {
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
    log("No header fixes applied (already OK).");
  }
}

// ───────────────────────────────────────────────
// FIX 2 — global.css shimmer: exclude .cc-header-icon
// ───────────────────────────────────────────────
function fixShimmer() {
  const globalPath = path.join(PROJECT_ROOT, "assets/css/global.css");
  let css = readSafe(globalPath);
  if (css === null) return;

  let changed = false;

  // Find all occurrences of shimmer selectors manually (no regex)
  const lines = css.split("\n");
  const newLines = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // Detect shimmer selector safely without regex
    const isShimmer =
      trimmed.startsWith("img[src*=\"crown\"]") ||
      trimmed.startsWith("svg[src*=\"crown\"]");

    if (isShimmer && !trimmed.includes(":not(.cc-header-icon)")) {
      // Apply fix
      line = line.replace(
        'img[src*="crown"]',
        'img[src*="crown"]:not(.cc-header-icon)'
      );
      line = line.replace(
        'svg[src*="crown"]',
        'svg[src*="crown"]:not(.cc-header-icon)'
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
    log("No shimmer fixes applied (already OK or no matching rules).");
  }
}

// ───────────────────────────────────────────────
// FIX 3 — header.css: ensure centered title block + icons absolute
// ───────────────────────────────────────────────
function fixHeaderCss() {
  const headerCssPath = path.join(PROJECT_ROOT, "assets/css/header.css");
  let css = readSafe(headerCssPath);
  if (css === null) return;

  let changed = false;

  // Ensure .cc-header-inner is column + centered
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

  // Ensure title block is centered
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

  // Ensure header icons are absolute at top corners
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
    log("No header.css fixes applied (already OK).");
  }
}

// ───────────────────────────────────────────────
// MAIN AUTO-FIX FLOW
// ───────────────────────────────────────────────
log("Starting auto-fix pass...\n");

fixHeader();
fixShimmer();
fixHeaderCss();

log("\nAUTO-FIX COMPLETE.");
log("Review updated files and re-run mother-scan for verification.");
