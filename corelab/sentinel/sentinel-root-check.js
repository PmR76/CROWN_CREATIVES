// sentinel-root-check.js — Node-only root diagnostics

const fs = require("fs");
const path = require("path");
const { getRoot } = require("../sentinel-root.cjs");

const ROOT = getRoot();

function logRoot() {
  console.log("Sentinel resolved root:", ROOT);
  console.log("Gallery path:", path.join(ROOT, "public/assets/images/gallery"));
  console.log("Sounds path:", path.join(ROOT, "public/sounds"));
  console.log("Manifests path:", path.join(ROOT, "public/manifests"));
}

logRoot();
