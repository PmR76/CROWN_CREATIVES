// Crown Creatives Core Lab Auto-Aggregator

const fs = require("fs");
const path = require("path");

const testDir = path.join(__dirname, "..");
const labs = fs.readdirSync(testDir).filter(f => f.endsWith("-lab"));

let sections = "";

labs.forEach(lab => {
  const labName = lab.replace("-lab", "");
  sections += `
<section>
  <h2>${labName} Lab</h2>
  <iframe src="../${lab}/${labName}-lab.html"
          style="width:100%;height:300px;border:1px solid #444;border-radius:8px;">
  </iframe>
</section>
`;
});

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="cc-lab" content="core-lab">
  <title>Crown Creatives – Core Lab</title>
  <link rel="stylesheet" href="./core-lab.css">
</head>
<body data-lab-name="core-lab">

  <h1>Crown Creatives – Core Lab</h1>

  ${sections}

  <script src="./core-lab.js"></script>
  <script src="./lab-harness.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "core-lab.html"), html);

console.log("core-lab.html generated.");
