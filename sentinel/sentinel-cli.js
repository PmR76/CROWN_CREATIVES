#!/usr/bin/env node

import readline from "readline";
import runGR1 from "./sentinel-gr1.js";
import runGR2 from "./sentinel-gr2.js";
import runGR3 from "./sentinel-gr3.js";

console.log("Sentinel CLI");
console.log("============");
console.log("[1] GR1 — Handshake");
console.log("[2] GR2 — Deep Scan");
console.log("[3] GR3 — Full Audit");
console.log("[0] Exit");
console.log("");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Select an option: ", async (answer) => {
  switch (answer.trim()) {
    case "1":
      await runGR1();
      break;
    case "2":
      await runGR2();
      break;
    case "3":
      await runGR3();
      break;
    case "0":
      console.log("Exiting Sentinel CLI.");
      rl.close();
      return;
    default:
      console.log("Invalid option.");
  }

  rl.close();
});
