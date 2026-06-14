import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to gallery folder
const galleryDir = path.join(__dirname, "..", "assets", "images", "gallery");

// Path to manifest file
const manifestPath = path.join(galleryDir, "manifest.json");

// Allowed image extensions
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".JPG"];

// Read directory and filter images
function getImages() {
  if (!fs.existsSync(galleryDir)) {
    console.error("Gallery directory not found:", galleryDir);
    return [];
  }

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
