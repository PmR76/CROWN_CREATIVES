import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve script location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root = one level above /scripts/
const rootDir = path.join(__dirname, "..");

// Directories
const galleryDir = path.join(rootDir, "assets", "images", "gallery");
const soundDir = path.join(rootDir, "assets", "sounds");

// Output manifest paths (CORRECTED)
const galleryManifestPath = path.join(galleryDir, "gallery-manifest.json");
const soundManifestPath = path.join(soundDir, "sound-manifest.json");

// Allowed extensions (case-insensitive)
const allowedExtensions = [
  ".jpg", ".jpeg", ".png", ".webp", ".gif",
  ".JPG", ".JPEG", ".PNG", ".WEBP", ".GIF",
  ".mp3", ".wav", ".MP3", ".WAV"
];

// Read + filter files
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

// Write manifest as a JSON array
function buildManifest(dir, outPath) {
  const files = getFiles(dir);

  console.log(`\n📁 Scanning: ${dir}`);
  console.log("   Found files:", files);

  // Always output a valid JSON array
  fs.writeFileSync(outPath, JSON.stringify(files, null, 2));

  console.log(`   ✅ Manifest written: ${outPath}`);
}

// Build both manifests
buildManifest(galleryDir, galleryManifestPath);
buildManifest(soundDir, soundManifestPath);

console.log("\n✨ All manifests generated successfully.\n");
