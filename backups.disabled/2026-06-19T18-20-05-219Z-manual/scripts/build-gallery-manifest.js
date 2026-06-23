import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// REAL repo root = one level above /scripts/
const rootDir = path.join(__dirname, "..");

// Gallery folder
const galleryDir = path.join(rootDir, "assets", "images", "gallery");

// Output manifest
const manifestPath = path.join(galleryDir, "manifest.json");

// Allowed image extensions
const allowed = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"];

function getImages() {
  if (!fs.existsSync(galleryDir)) {
    console.log("Gallery folder missing:", galleryDir);
    return [];
  }

  const files = fs.readdirSync(galleryDir);
  return files.filter(f => allowed.includes(path.extname(f)));
}

function build() {
  const images = getImages();
  console.log("Gallery images found:", images);
  fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2));
  console.log("Gallery manifest written:", manifestPath);
}

build();
