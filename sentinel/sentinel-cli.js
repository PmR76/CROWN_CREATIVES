#!/usr/bin/env node

const readline = require("readline");
const gr1 = require("./sentinel-gr1");
const gr2 = require("./sentinel-gr2");
const gr3 = require("./sentinel-gr3");

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
      await gr1();
      break;
    case "2":
      await gr2();
      break;
    case "3":
      await gr3();
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
