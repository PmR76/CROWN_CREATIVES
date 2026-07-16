const gr1 = require("./sentinel-gr1");
const gr2 = require("./sentinel-gr2");

module.exports = async function runGR3() {
  console.log("[GR3] Running Full Audit...");
  await gr1();
  await gr2();
  console.log("[GR3] Full Audit Complete.");
};
