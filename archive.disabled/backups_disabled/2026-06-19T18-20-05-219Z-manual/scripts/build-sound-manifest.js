import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// REAL repo root = one level above /scripts/
const rootDir = path.join(__dirname, "..");

// Sound folder
const soundDir = path.join(rootDir, "assets", "sounds");

// Output manifest
const manifestPath = path.join(soundDir, "sound-manifest.json");

// Allowed audio extensions
const allowed = [".mp3", ".wav", ".ogg", ".MP3", ".WAV"];

function getSounds() {
  if (!fs.existsSync(soundDir)) {
    console.log("Sound folder missing:", soundDir);
    return [];
  }

  const files = fs.readdirSync(soundDir);
  return files.filter(f => allowed.includes(path.extname(f)));
}

function build() {
  const sounds = getSounds();
  console.log("Sound files found:", sounds);
  fs.writeFileSync(manifestPath, JSON.stringify(sounds, null, 2));
  console.log("Sound manifest written:", manifestPath);
}

build();
