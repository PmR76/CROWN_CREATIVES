/* ============================================================
   BUILD GALLERY MANIFEST — FULL FILE (v=20240614-1215)
   Scans /assets/images/gallery/ and writes manifest.json
============================================================ */

const fs = require("fs");
const path = require("path");

const galleryDir = path.join(__dirname, "..", "assets", "images", "gallery");
const manifestPath = path.join(galleryDir, "manifest.json");

function isImage(file) {
  return /\.(jpg|jpeg|png|webp)$/i.test(file);
}

function buildManifest() {
  try {
    const files = fs.readdirSync(galleryDir)
      .filter(isImage)
      .sort();

    fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2));

    console.log("Gallery manifest updated:");
    console.log(files);
  } catch (err) {
    console.error("Error building gallery manifest:", err);
    process.exit(1);
  }
}

buildManifest();
