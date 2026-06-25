// CROWN CREATIVES — Gallery Manifest Generator v1.0
// Scans /assets/images/gallery and writes gallery-manifest.json

const fs = require("fs");
const path = require("path");

const GALLERY_DIR = path.join(__dirname, "..", "assets", "images", "gallery");
const MANIFEST_PATH = path.join(GALLERY_DIR, "gallery-manifest.json");

const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isImage(file) {
  return VALID_EXT.includes(path.extname(file).toLowerCase());
}

function generateManifest() {
  console.log("Scanning gallery:", GALLERY_DIR);

  if (!fs.existsSync(GALLERY_DIR)) {
    console.error("Gallery folder does not exist:", GALLERY_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(GALLERY_DIR)
    .filter(isImage)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  console.log("Found", files.length, "images.");

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(files, null, 2), "utf8");

  console.log("Manifest written to:", MANIFEST_PATH);
}

generateManifest();
