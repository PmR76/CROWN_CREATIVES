import fs from "fs";

const required = [
  "public/assets/images/gallery",
  "public/sounds"
];

for (const folder of required) {
  if (!fs.existsSync(folder)) {
    console.error("❌ Missing required folder:", folder);
    process.exit(1);
  }
}

console.log("✔ All required folders exist.");
