// ============================================================
// CoreLab Quarantine Engine — Ghost File Isolation
// ============================================================

import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");
const QUARANTINE = path.resolve("src/quarantine");

// Ensure quarantine folder exists
if (!fs.existsSync(QUARANTINE)) {
  fs.mkdirSync(QUARANTINE);
}

const ghostFiles = [
  "components/Background3DGradient.js",
  "diagnostics/findAsyncLabs.js",
  "diagnostics/gr3-diagnostic.js",
  "labs/moduleRegistry.js",
  "live/livePointer.js",
  "main.jsx",
  "theme-panel/themePanel.js"
];

// Move ghost files into quarantine
ghostFiles.forEach((relPath) => {
  const fullPath = path.join(ROOT, relPath);

  if (fs.existsSync(fullPath)) {
    const dest = path.join(QUARANTINE, relPath.replace(/\//g, "_"));

    try {
      fs.renameSync(fullPath, dest);
      console.log(`🟡 Quarantined: ${relPath}`);
    } catch (err) {
      console.log(`❌ Failed to quarantine ${relPath}:`, err.message);
    }
  } else {
    console.log(`⚪ Skipped (not found): ${relPath}`);
  }
});

console.log("\n=== QUARANTINE COMPLETE ===");
console.log("Ghost files have been isolated.");
console.log("Re-run Vite and diagnostics.");
