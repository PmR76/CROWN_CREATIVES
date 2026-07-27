// ============================================================
// CORELAB CSS PATCH MERGER
// - Copies patched CSS from /css-patches into /styles
// - Backs up originals into /css-backups
// ============================================================

import fs from "fs";
import path from "path";

const STYLES_ROOT = path.resolve("src/styles");
const PATCH_ROOT = path.resolve("src/diagnostics/css-patches");
const BACKUP_ROOT = path.resolve("src/diagnostics/css-backups");

if (!fs.existsSync(PATCH_ROOT)) {
  console.log("No patches found. Exiting.");
  process.exit(0);
}

if (!fs.existsSync(BACKUP_ROOT)) {
  fs.mkdirSync(BACKUP_ROOT, { recursive: true });
}

console.log("=== CORELAB CSS PATCH MERGER START ===");

const patchFiles = fs
  .readdirSync(PATCH_ROOT)
  .filter((f) => f.endsWith(".css"));

patchFiles.forEach((file) => {
  const patchPath = path.join(PATCH_ROOT, file);
  const targetPath = path.join(STYLES_ROOT, file);
  const backupPath = path.join(BACKUP_ROOT, file);

  if (fs.existsSync(targetPath)) {
    // backup original
    fs.copyFileSync(targetPath, backupPath);
    console.log(`📦 Backup created: ${backupPath}`);
  }

  // apply patch
  fs.copyFileSync(patchPath, targetPath);
  console.log(`🛠 Applied patch: ${patchPath} → ${targetPath}`);
});

console.log("=== CORELAB CSS PATCH MERGER COMPLETE ===");
console.log("Originals backed up in /src/diagnostics/css-backups/");
