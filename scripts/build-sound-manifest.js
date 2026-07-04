// ============================================================
// Auto Manifest Generator — Crown Creatives
// Watches /public/assets/sounds and regenerates sound-manifest.json
// ============================================================

import fs from "fs";
import path from "path";

const soundsDir = path.resolve("public/assets/sounds");
const manifestFile = path.join(soundsDir, "sound-manifest.json");

function generateManifest() {
  const files = fs.readdirSync(soundsDir)
    .filter(f => f.toLowerCase().endsWith(".mp3"));

  const manifest = {
    tracks: {}
  };

  files.forEach((file, index) => {
    manifest.tracks[`track${index + 1}`] = file;
  });

  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  console.log(`✔ Sound manifest updated (${files.length} tracks)`);
}

generateManifest();

// Watch for changes
fs.watch(soundsDir, { persistent: true }, (event, filename) => {
  if (filename && filename.toLowerCase().endsWith(".mp3")) {
    console.log(`🔄 Change detected: ${filename}`);
    generateManifest();
  }
});
