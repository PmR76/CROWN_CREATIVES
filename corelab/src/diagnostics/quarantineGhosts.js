// ============================================================
// CoreLab Safe Quarantine Engine — Ghost File Isolation
// ============================================================

import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");
const QUARANTINE = path.resolve("src/quarantine");

// Ensure quarantine folder exists
if (!fs.existsSync(QUARANTINE)) {
  fs.mkdirSync(QUARANTINE);
}

// These files MUST NEVER be quarantined
const CORE_FILES = [
  "main.jsx",
  "labs/moduleRegistry.js",
  "theme-panel/themePanel.js",
  "live/livePointer.js",
  "diagnostics/gr3-diagnostic.js"
];

// Load ghost list from scanner output
const ghostFiles = [
  "components/Background3DGradient.js",
  "diagnostics/findAsyncLabs.js",
  "diagnostics/gr3-diagnostic.js",
  "labs/moduleRegistry.js",
  "live/livePointer.js",
  "main.jsx",
  "theme-panel/themePanel.js"
];

console.log("=== SAFE QUARANTINE START ===");

ghostFiles.forEach((relPath) => {
  const fullPath = path.join(ROOT, relPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚪ Skipped (not found): ${relPath}`);
    continue;
  }

  // Protect core runtime files
  if (CORE_FILES.includes(relPath)) {
    console.log(`🛑 Protected (core file): ${relPath}`);
    continue;
  }

  // Quarantine safe ghost files
  const dest = path.join(QUARANTINE, relPath.replace(/\//g, "_"));

  try {
    fs.renameSync(fullPath, dest);
    console.log(`🟡 Quarantined: ${relPath}`);
  } catch (err) {
    console.log(`❌ Failed to quarantine ${relPath}: ${err.message}`);
  }
});

console.log("\n=== SAFE QUARANTINE COMPLETE ===");
console.log("Only non-core ghost files were isolated.");
