import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root = one level above /scripts/
const rootDir = path.join(__dirname, "..");

// Path to gallery folder
const galleryDir = path.join(rootDir, "assets", "images", "gallery");

// Path to manifest file
const manifestPath = path.join(galleryDir, "manifest.json");

// Allowed image extensions
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"];

function ensureGalleryDir() {
  if (!fs.existsSync(galleryDir)) {
    console.log("Gallery directory not found:", galleryDir);
    return [];
  }
}

function getImages() {
  ensureGalleryDir();
  const files = fs.readdirSync(galleryDir);
  return files.filter((file) =>
    allowedExtensions.includes(path.extname(file))
  );
}

function buildManifest() {
  const images = getImages();
  console.log("Found images:", images);
  fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2));
  console.log("Manifest written to:", manifestPath);
}

buildManifest();
