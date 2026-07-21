// verify-folders.js — Cloudflare‑safe folder checker

import fs from "fs";
import path from "path";
import { getRoot } from "../sentinel-root.js";

const ROOT = getRoot();

const REQUIRED_FOLDERS = [
  "public/assets/images/gallery",
  "public/assets/icons",
  "public/manifests",
  "public/sounds"
];

function checkFolder(relativePath) {
  const fullPath = path.join(ROOT, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required folder: ${relativePath}`);
    process.exit(1);
  } else {
    console.log(`✅ Found: ${relativePath}`);
  }
}

console.log("🔍 Verifying required folders...");

REQUIRED_FOLDERS.forEach(checkFolder);

console.log("✅ Folder verification complete.");
