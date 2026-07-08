import fs from "fs";
import path from "path";

const root = process.cwd();
const soundsDir = path.join(root, "public", "sounds");
const galleryDir = path.join(root, "public", "gallery");
const manifestsDir = path.join(root, "public", "manifests");

if (!fs.existsSync(manifestsDir)) {
  fs.mkdirSync(manifestsDir);
}

function buildSoundManifest() {
  const files = fs.readdirSync(soundsDir).filter(f => f.endsWith(".mp3"));
  const json = { tracks: files };
  fs.writeFileSync(path.join(manifestsDir, "sound-manifest.json"), JSON.stringify(json, null, 2));
}

function buildGalleryManifest() {
  const files = fs.readdirSync(galleryDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  const json = { images: files };
  fs.writeFileSync(path.join(manifestsDir, "gallery-manifest.json"), JSON.stringify(json, null, 2));
}

buildSoundManifest();
buildGalleryManifest();

console.log("Manifests built successfully.");
