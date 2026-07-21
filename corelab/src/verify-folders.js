// ============================================================
// verify-folders.js — Cloudflare-Safe Folder Checker (GR1)
// ============================================================

import fs from "fs";
import path from "path";

// Cloudflare builds from repo root, not /corelab
// So all required folders must be prefixed with corelab/
const REQUIRED_FOLDERS = [
  "corelab/public/assets/images/gallery",
  "corelab/public/assets/icons",
  "corelab/public/manifests",
  "corelab/public/sounds"
];

function checkFolder(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required folder: ${relativePath}`);
    process.exit(1);
  } else {
    console.log(`✔ Found: ${relativePath}`);
  }
}

console.log("🔍 Verifying required folders...");

REQUIRED_FOLDERS.forEach(checkFolder);

console.log("✔ Folder verification complete");
