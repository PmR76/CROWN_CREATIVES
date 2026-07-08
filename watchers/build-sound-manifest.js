const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const SOURCE_DIR = path.resolve(__dirname, "../public/sounds");
const OUTPUT_NAME = "sound-manifest.json";

function buildManifest() {
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.toLowerCase().endsWith(".mp3"));

  const manifest = { tracks: files };
  const json = JSON.stringify(manifest, null, 2);

  config.projects.forEach(target => {
    const outPath = path.join(target, OUTPUT_NAME);
    fs.writeFileSync(outPath, json);
    console.log("Updated:", outPath);
  });
}

buildManifest();
