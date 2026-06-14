import fs from "fs";
import path from "path";

// Repo root (GitHub Actions checks out here)
const rootDir = process.cwd();

// Path to gallery folder
const galleryDir = path.join(rootDir, "assets", "images", "gallery");

// Path to manifest file
const manifestPath = path.join(galleryDir, "manifest.json");

// Allowed image extensions
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"];

// Ensure gallery directory exists
function ensureGalleryDir() {
  if (!fs.existsSync(galleryDir)) {
    console.log("Gallery directory not found, creating:", galleryDir);
    fs.mkdirSync(galleryDir, { recursive: true });
  }
}

// Read directory and filter images
function getImages() {
  ensureGalleryDir();

  const files = fs.readdirSync(galleryDir);

  return files.filter((file) =>
    allowedExtensions.includes(path.extname(file))
  );
}

// Build manifest
function buildManifest() {
  const images = getImages();

  console.log("Found images:", images);

  fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2));

  console.log("Manifest written to:", manifestPath);
}

buildManifest();
