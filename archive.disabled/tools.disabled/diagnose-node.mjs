#!/usr/bin/env node
import fs from "fs";
import path from "path";

console.log("=== NODE ENVIRONMENT DIAGNOSTIC ===\n");

// 1. Show where Node thinks THIS file is
console.log("import.meta.url =", import.meta.url);

// 2. Show dirname
const DIRNAME = path.dirname(new URL(import.meta.url).pathname);
console.log("dirname(import.meta.url) =", DIRNAME);

// 3. Show CWD
console.log("process.cwd() =", process.cwd());

// 4. Compute PROJECT_ROOT the same way GR3 does
const PROJECT_ROOT = path.resolve(DIRNAME, "../../");
console.log("PROJECT_ROOT =", PROJECT_ROOT);

// 5. Compute REPORTS_DIR
const REPORTS_DIR = path.join(PROJECT_ROOT, "reports");
console.log("REPORTS_DIR =", REPORTS_DIR);

// 6. Check if REPORTS_DIR exists
console.log("REPORTS_DIR exists =", fs.existsSync(REPORTS_DIR));

// 7. List files in REPORTS_DIR (if exists)
if (fs.existsSync(REPORTS_DIR)) {
  console.log("REPORTS_DIR contents =", fs.readdirSync(REPORTS_DIR));
} else {
  console.log("REPORTS_DIR contents = <not accessible>");
}

console.log("\n=== END OF DIAGNOSTIC ===");
