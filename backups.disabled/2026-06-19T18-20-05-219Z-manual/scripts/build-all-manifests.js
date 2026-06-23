import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// REAL repo root = one level above /scripts/
const rootDir = path.join(__dirname, "..");

// Path to gallery/sound folder
const galleryDir = path.join(rootDir, "assets", "images", "gallery");
// OR for sound:
const soundDir = path.join(rootDir, "assets", "sounds");

// Path to manifest file
const manifestPath = path.join(galleryDir, "manifest.json");
// OR for sound:
const soundManifestPath = path.join(soundDir, "sound-manifest.json");

// Allowed extensions
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".mp3", ".wav", ".JPG", ".PNG"];

function getFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log("Directory not found:", dir);
    return [];
  }

  const files = fs.readdirSync(dir);
  return files.filter(file =>
    allowedExtensions.includes(path.extname(file))
  );
}

function buildManifest(dir, outPath) {
  const files = getFiles(dir);
  console.log("Found files:", files);
  fs.writeFileSync(outPath, JSON.stringify(files, null, 2));
  console.log("Manifest written:", outPath);
}

// Build both
buildManifest(galleryDir, manifestPath);
// OR for sound:
buildManifest(soundDir, soundManifestPath);
