const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const SOURCE_DIR = path.resolve(__dirname, "../public/gallery");
const OUTPUT_NAME = "gallery-manifest.json";

function buildManifest() {
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

  const manifest = { images: files };
  const json = JSON.stringify(manifest, null, 2);

  config.projects.forEach(target => {
    const outPath = path.join(target, OUTPUT_NAME);
    fs.writeFileSync(outPath, json);
    console.log("Updated:", outPath);
  });
}

buildManifest();
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const SOURCE_DIR = path.resolve(__dirname, "../public/gallery");
const OUTPUT_NAME = "gallery-manifest.json";

function buildManifest() {
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

  const manifest = { images: files };
  const json = JSON.stringify(manifest, null, 2);

  config.projects.forEach(target => {
    const outPath = path.join(target, OUTPUT_NAME);
    fs.writeFileSync(outPath, json);
    console.log("Updated:", outPath);
  });
}

buildManifest();
