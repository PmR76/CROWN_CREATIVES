// ============================================================
// verify-folders.js — Auto Root Detection (Cloudflare Safe)
// ============================================================

import fs from "fs";
import path from "path";

// Detect whether we are in repo root or corelab/
const ROOT = fs.existsSync(path.join(process.cwd(), "corelab"))
  ? process.cwd()
  : path.join(process.cwd(), "corelab");

function checkFolder(relativePath) {
  const fullPath = path.join(ROOT, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required folder: ${relativePath}`);
    process.exit(1);
  } else {
    console.log(`✔ Found: ${relativePath}`);
  }
}

console.log("🔍 Verifying required folders...");

[
  "public/assets/images/gallery",
  "public/assets/icons",
  "public/manifests",
  "public/sounds"
].forEach(checkFolder);

console.log("✔ Folder verification complete");
