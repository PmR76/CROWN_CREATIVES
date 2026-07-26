// ============================================================
// CoreLab Restore Engine — Safe Recovery of Core Runtime Files
// ============================================================

import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");
const QUARANTINE = path.resolve("src/quarantine");

// Core files that must be restored
const CORE_FILES = {
  "main.jsx": "main.jsx",
  "labs_moduleRegistry.js": "labs/moduleRegistry.js",
  "theme-panel_themePanel.js": "theme-panel/themePanel.js",
  "live_livePointer.js": "live/livePointer.js",
  "diagnostics_gr3-diagnostic.js": "diagnostics/gr3-diagnostic.js"
};

console.log("=== CORELAB RESTORE ENGINE START ===");

// Restore core files
Object.entries(CORE_FILES).forEach(([quarantineName, originalPath]) => {
  const quarantineFile = path.join(QUARANTINE, quarantineName);
  const restorePath = path.join(ROOT, originalPath);

  if (fs.existsSync(quarantineFile)) {
    // Ensure destination folder exists
    const restoreDir = path.dirname(restorePath);
    if (!fs.existsSync(restoreDir)) {
      fs.mkdirSync(restoreDir, { recursive: true });
    }

    try {
      fs.renameSync(quarantineFile, restorePath);
      console.log(`🟢 Restored: ${originalPath}`);
    } catch (err) {
      console.log(`❌ Failed to restore ${originalPath}: ${err.message}`);
    }
  } else {
    console.log(`⚪ Missing in quarantine: ${quarantineName}`);
  }
});

// Delete all remaining quarantine files
const remaining = fs.readdirSync(QUARANTINE);

remaining.forEach((file) => {
  const full = path.join(QUARANTINE, file);
  try {
    fs.unlinkSync(full);
    console.log(`🗑️ Deleted leftover quarantine file: ${file}`);
  } catch (err) {
    console.log(`❌ Failed to delete ${file}: ${err.message}`);
  }
});

console.log("\n=== RESTORE COMPLETE ===");
console.log("Core runtime files restored. Quarantine cleaned.");
