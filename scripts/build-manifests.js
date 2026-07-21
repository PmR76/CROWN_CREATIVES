// ============================================================
// build-manifests.js — Unified Media Scanner (Images + Sounds)
// Cloudflare‑safe + corelab‑aligned
// ============================================================

import fs from "fs";
import path from "path";
import { getRoot } from "../sentinel-root.js";

// ------------------------------------------------------------
// ROOT & FOLDERS
// ------------------------------------------------------------
const ROOT = getRoot();

const galleryFolder  = path.join(ROOT, "public/assets/images/gallery");
const soundFolder    = path.join(ROOT, "public/sounds");
const manifestFolder = path.join(ROOT, "public/manifests");

const galleryManifest = path.join(manifestFolder, "gallery-manifest.json");
const soundManifest   = path.join(manifestFolder, "sound-manifest.json");

// Ensure manifest folder exists
if (!fs.existsSync(manifestFolder)) {
  fs.mkdirSync(manifestFolder, { recursive: true });
}

// ------------------------------------------------------------
// SCAN A FOLDER
// ------------------------------------------------------------
function scanFolder(folder, filterFn = null) {
  if (!fs.existsSync(folder)) {
    console.error("Folder missing:", folder);
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

  // 2. Sounds (.mp3 only)
  const soundFiles = scanFolder(soundFolder, f => f.toLowerCase().endsWith(".mp3"));
  writeManifest(soundManifest, soundFiles);

  console.log("=== Scanner Complete ===");
}

run();
