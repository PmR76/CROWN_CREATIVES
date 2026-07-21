// ============================================================
// build-manifests.js — Unified Media Scanner (Images + Sounds)
// ============================================================

import fs from "fs";
import path from "path";

// ------------------------------------------------------------
// ROOT & FOLDERS (Cloudflare + local safe)
// ------------------------------------------------------------
const ROOT = fs.existsSync(path.join(process.cwd(), "corelab"))
  ? path.join(process.cwd(), "corelab")
  : process.cwd();

const galleryFolder = path.join(ROOT, "public/assets/images/gallery");
const soundFolder   = path.join(ROOT, "public/sounds");

// ------------------------------------------------------------
// OUTPUT MANIFESTS
// ------------------------------------------------------------
const galleryManifest = path.join(galleryFolder, "gallery-manifest.json");
const soundManifest   = path.join(soundFolder, "sound-manifest.json");

// ------------------------------------------------------------
// SCAN A FOLDER
// ------------------------------------------------------------
function scanFolder(folder) {
  if (!fs.existsSync(folder)) {
    console.error("Folder missing:", folder);
    return [];
  }

  const files = fs.readdirSync(folder)
    .filter(f => !f.startsWith("."))
    .filter(f => !fs.lstatSync(path.join(folder, f)).isDirectory());

  return files;
}

// ------------------------------------------------------------
// WRITE MANIFEST
// ------------------------------------------------------------
function writeManifest(filePath, list) {
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  console.log("Updated manifest:", filePath);
}

// ------------------------------------------------------------
// RUN SCANNER
// ------------------------------------------------------------
function run() {
  console.log("=== Unified Media Scanner ===");

  // 1. Gallery
  const galleryFiles = scanFolder(galleryFolder);
  writeManifest(galleryManifest, galleryFiles);

  // 2. Sounds
  const soundFiles = scanFolder(soundFolder);
  writeManifest(soundManifest, soundFiles);

  console.log("=== Scanner Complete ===");
}

run();
