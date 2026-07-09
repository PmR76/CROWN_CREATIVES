const fs = require("fs");
const path = require("path");

// CONFIG — adjust if needed
const ICONS_DIR = path.join(__dirname, "public", "assets", "icons");
const SRC_DIR = path.join(__dirname, "src");

// Get all image files in icons folder
const imageFiles = fs.readdirSync(ICONS_DIR).filter(file =>
  /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(file)
);

// Recursively collect all source files
function getAllSourceFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getAllSourceFiles(filePath));
    } else if (/\.(js|jsx|ts|tsx)$/i.test(file)) {
      results.push(filePath);
    }
  });

  return results;
}

const sourceFiles = getAllSourceFiles(SRC_DIR);

// Check usage
const unused = [];

imageFiles.forEach(image => {
  const imageName = image;
  const found = sourceFiles.some(srcFile => {
    const content = fs.readFileSync(srcFile, "utf8");
    return content.includes(imageName);
  });

  if (!found) unused.push(imageName);
});

// Output results
console.log("🔍 Image usage check complete.\n");

if (unused.length === 0) {
  console.log("✅ All images in public/assets/icons are used in the codebase.");
} else {
  console.log("⚠️ Unused images found:");
  unused.forEach(img => console.log(" - " + img));
}
