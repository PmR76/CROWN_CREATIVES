// Crown Creatives Lab Generator
// Usage: node lab-generator.js cards

const fs = require("fs");
const path = require("path");

const labName = process.argv[2];
if (!labName) {
  console.error("Please specify a lab name, e.g. node lab-generator.js cards");
  process.exit(1);
}

const folder = path.join(__dirname, `${labName}-lab`);
if (fs.existsSync(folder)) {
  console.error("Lab folder already exists:", folder);
  process.exit(1);
}

fs.mkdirSync(folder);

// Create lab HTML
fs.writeFileSync(
  path.join(folder, `${labName}-lab.html`),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="cc-lab" content="${labName}-lab">
  <title>Crown Creatives – ${labName} Lab</title>
  <link rel="stylesheet" href="./${labName}-lab.css">
</head>
<body data-lab-name="${labName}-lab">

  <div id="lab-root">
    <iframe src="./${labName}-index.html"
            style="width:100%;height:400px;border:1px solid #444;border-radius:8px;">
    </iframe>
  </div>

  <script src="./${labName}-lab.js"></script>
  <script src="./lab-harness.js"></script>
</body>
</html>`
);

// Create lab CSS
fs.writeFileSync(
  path.join(folder, `${labName}-lab.css`),
  `/* ${labName}-lab CSS */`
);

// Create lab JS
fs.writeFileSync(
  path.join(folder, `${labName}-lab.js`),
  `// ${labName}-lab JS`
);

// Create component under test
fs.writeFileSync(
  path.join(folder, `${labName}-index.html`),
  `<!doctype html>
<html><body>
  <h1>${labName} component under test</h1>
</body></html>`
);

// Copy harness
fs.copyFileSync(
  path.join(__dirname, "template-lab", "lab-harness.js"),
  path.join(folder, "lab-harness.js")
);

console.log("Lab created:", folder);
