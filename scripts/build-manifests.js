// ============================================================
// build-manifests.js — Unified Media Scanner (Images + Sounds)
// Stable version — never hard-fails on missing folders
// ============================================================

import fs from "fs";
import path from "path";

// ------------------------------------------------------------
// FOLDERS (match current repo structure)
// ------------------------------------------------------------
const galleryFolder  = path.join(process.cwd(), "public/assets/images/gallery");
const soundFolder    = path.join(process.cwd(), "public/sounds");
const manifestFolder = path.join(process.cwd(), "public/manifests");

// ------------------------------------------------------------
// OUTPUT MANIFEST PATHS
// ------------------------------------------------------------
const galleryManifest = path.join(manifestFolder, "gallery-manifest.json");
const soundManifest   = path.join(manifestFolder, "sound-manifest.json");

// ------------------------------------------------------------
// ENSURE REQUIRED FOLDERS EXIST
// ------------------------------------------------------------
function ensureFolder(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log("Created folder:", folder);
  }
}

ensureFolder(manifestFolder);
ensureFolder(galleryFolder);
ensureFolder(soundFolder);

// ------------------------------------------------------------
// SCAN A FOLDER
// ------------------------------------------------------------
function scanFolder(folder, filterFn = null) {
  if (!fs.existsSync(folder)) {
    console.error("Folder missing (will use empty list):", folder);
    return [];
  }

  let files = fs.readdirSync(folder)
    .filter(f => !f.startsWith("."))
    .filter(f => !fs.lstatSync(path.join(folder, f)).isDirectory());

  if (filterFn) {
    files = files.filter(filterFn);
  }

  return files;
}

// ------------------------------------------------------------
// WRITE MANIFEST
// ------------------------------------------------------------
function writeManifest(filePath, list) {
  const json = JSON.stringify(list, null, 2);
  fs.writeFileSync(filePath, json);
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

  // 2. Sounds (.mp3 only)
  const soundFiles = scanFolder(soundFolder, f => f.toLowerCase().endsWith(".mp3"));
  writeManifest(soundManifest, soundFiles);

  console.log("=== Scanner Complete ===");
}

run();
