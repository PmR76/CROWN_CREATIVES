// CROWN CREATIVES — Gallery Manifest Generator v2.0
// Auto-scan + Auto-watch + Pretty JSON

const fs = require("fs");
const path = require("path");

const GALLERY_DIR = path.join(__dirname, "..", "assets", "images", "gallery");
const MANIFEST_PATH = path.join(GALLERY_DIR, "gallery-manifest.json");

const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isImage(file) {
  return VALID_EXT.includes(path.extname(file).toLowerCase());
}

function generateManifest() {
  const files = fs.readdirSync(GALLERY_DIR)
    .filter(isImage)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(files, null, 2), "utf8");

  console.log(`[Manifest Updated] ${files.length} images`);
}

function startWatcher() {
  console.log("Watching gallery folder for changes…");

  fs.watch(GALLERY_DIR, { recursive: false }, (event, filename) => {
    if (!filename) return;
    if (!isImage(filename)) return;

    console.log(`[Change Detected] ${event}: ${filename}`);
    generateManifest();
  });
}

// Initial run
generateManifest();

// Watch mode
startWatcher();
