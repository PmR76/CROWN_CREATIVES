// build-manifests.cjs — Unified Media Scanner (CommonJS)

const fs = require("fs");
const path = require("path");

const galleryFolder  = path.join(process.cwd(), "public/assets/images/gallery");
const soundFolder    = path.join(process.cwd(), "public/sounds");
const manifestFolder = path.join(process.cwd(), "public/manifests");

const galleryManifest = path.join(manifestFolder, "gallery-manifest.json");
const soundManifest   = path.join(manifestFolder, "sound-manifest.json");

function ensureFolder(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log("Created folder:", folder);
  }
}

ensureFolder(manifestFolder);
ensureFolder(galleryFolder);
ensureFolder(soundFolder);

function scanFolder(folder, filterFn = null) {
  if (!fs.existsSync(folder)) {
    console.error("Folder missing (using empty list):", folder);
    return [];
  }

  let files = fs.readdirSync(folder)
    .filter(f => !f.startsWith("."))
    .filter(f => !fs.lstatSync(path.join(folder, f)).isDirectory());

  if (filterFn) files = files.filter(filterFn);

  return files;
}

function writeManifest(filePath, list) {
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  console.log("Updated manifest:", filePath);
}

function run() {
  console.log("=== Unified Media Scanner ===");

  const galleryFiles = scanFolder(galleryFolder);
  writeManifest(galleryManifest, galleryFiles);

  const soundFiles = scanFolder(soundFolder, f => f.toLowerCase().endsWith(".mp3"));
  writeManifest(soundManifest, soundFiles);

  console.log("=== Scanner Complete ===");
}

run();
