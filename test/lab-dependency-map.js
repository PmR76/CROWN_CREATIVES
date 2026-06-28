// Crown Creatives Lab Dependency Map

const fs = require("fs");
const path = require("path");

const testDir = __dirname;
const labs = fs.readdirSync(testDir).filter(f => f.endsWith("-lab"));

console.log("Crown Creatives Lab Dependency Map");
console.log("--------------------------------\n");

labs.forEach(lab => {
  const labPath = path.join(testDir, lab);
  const labName = lab.replace("-lab", "");

  const html = fs.readFileSync(path.join(labPath, `${labName}-lab.html`), "utf8");

  const deps = {
    html: html.includes(`${labName}-index.html`),
    css: html.includes(`${labName}-lab.css`),
    js: html.includes(`${labName}-lab.js`),
    harness: html.includes("lab-harness.js")
  };

  console.log(`Lab: ${lab}`);
  console.log(`  HTML: ${deps.html ? "✔" : "❌"}`);
  console.log(`  CSS: ${deps.css ? "✔" : "❌"}`);
  console.log(`  JS: ${deps.js ? "✔" : "❌"}`);
  console.log(`  Harness: ${deps.harness ? "✔" : "❌"}`);
  console.log("");
});
