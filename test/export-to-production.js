// Crown Creatives Export-to-Production Pipeline

const fs = require("fs");
const path = require("path");

const testDir = __dirname;
const exportDir = path.join(testDir, "..", "production");

if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

const labs = fs.readdirSync(testDir).filter(f => f.endsWith("-lab"));

console.log("Exporting stable labs to production...\n");

labs.forEach(lab => {
  const labPath = path.join(testDir, lab);
  const labName = lab.replace("-lab", "");

  const versionFile = path.join(labPath, `${labName}-version.json`);
  if (!fs.existsSync(versionFile)) {
    console.log(`Skipping ${lab} — no version file.`);
    return;
  }

  const version = JSON.parse(fs.readFileSync(versionFile, "utf8"));

  if (!version.stable) {
    console.log(`Skipping ${lab} — not marked stable.`);
    return;
  }

  const dest = path.join(exportDir, labName);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);

  fs.copyFileSync(
    path.join(labPath, `${labName}-index.html`),
    path.join(dest, `${labName}.html`)
  );

  console.log(`✔ Exported ${labName} v${version.version}`);
});

console.log("\nDone.");
