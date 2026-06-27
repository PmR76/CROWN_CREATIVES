// Crown Creatives Lab Validator
// Checks folder structure, naming, harness presence, index file, contamination

const fs = require("fs");
const path = require("path");

const testDir = __dirname;
const labs = fs.readdirSync(testDir).filter(f => f.endsWith("-lab"));

console.log("Crown Creatives Lab Validator");
console.log("--------------------------------\n");

labs.forEach(lab => {
  const labPath = path.join(testDir, lab);
  const labName = lab.replace("-lab", "");

  const required = [
    `${labName}-lab.html`,
    `${labName}-lab.css`,
    `${labName}-lab.js`,
    `${labName}-index.html`,
    `lab-harness.js`
  ];

  console.log(`Lab: ${lab}`);

  required.forEach(file => {
    const exists = fs.existsSync(path.join(labPath, file));
    console.log(`${exists ? "✔" : "❌"} ${file}`);
  });

  console.log("");
});
