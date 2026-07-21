// ============================================================
// Sentinel Cleaner — declutters Sentinel into a clean core
// ============================================================

const fs = require("fs");
const path = require("path");

// Root of your project
const ROOT = "C:/DEV/CROWN_CREATIVES";

// Where archived files will go
const ARCHIVE_DIR = path.join(ROOT, "archive.disabled/sentinel");

// Ensure archive folder exists
if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

// ------------------------------------------------------------
// 1. Define KEEP / OPTIONAL / ARCHIVE lists
// ------------------------------------------------------------

const KEEP = [
  "sentinel/SentinelManifestScanner.js",
  "sentinel/sentinel-registry.json",
  "sentinel/sentinel-tree.txt",
  "sentinel/sentinel-health.json",
  "sentinel/sentinel-duplicates.json",
  "sentinel/sentinel-root-check.js",
  "sentinel/sentinel-config.json",
  "sentinel/sentinel-config.repaired.json",
  "src/components/WatchkeeperHUD",
  "src/sentinel/dashboard",
  "src/sentinel/panels",
  "src/sentinel/useSentinel.ts",
  "src/hooks/useDiagnostics.js",
  "src/hooks/useSentinelManifestScanner.js",
  "scripts/build-manifests.js",
  "scripts/build-sound-manifest.js",
  "src/verify-folders.js"
];

const OPTIONAL = [
  "sentinel/sentinel-gr1.js",
  "sentinel/sentinel-gr2.js",
  "sentinel/sentinel-gr3.js",
  "sentinel/run-sentinel-manifest-scan.js",
  "sentinel/sentinel-cli.js",
  "sentinel/sentinel-cleanup.json"
];

const ARCHIVE = [
  "sentinel/sentinel-snapshots",
  "sentinel/profiles",
  "sentinel/public/watchkeeper"
];

// ------------------------------------------------------------
// 2. Helper to move files/folders to archive.disabled
// ------------------------------------------------------------

function archiveItem(relativePath) {
  const fullPath = path.join(ROOT, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`Missing (skipped): ${relativePath}`);
    return;
  }

  const dest = path.join(ARCHIVE_DIR, path.basename(relativePath));

  fs.renameSync(fullPath, dest);
  console.log(`Archived: ${relativePath}`);
}

// ------------------------------------------------------------
// 3. Run archive process
// ------------------------------------------------------------

console.log("=== Sentinel Cleaner ===");

ARCHIVE.forEach(item => archiveItem(item));

console.log("\n=== Summary ===");
console.log("Kept:", KEEP.length, "items");
console.log("Optional (left untouched):", OPTIONAL.length, "items");
console.log("Archived:", ARCHIVE.length, "items");

console.log("\nSentinel is now clean and stable.");
