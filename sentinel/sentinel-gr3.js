import runGR1 from "./sentinel-gr1.js";
import runGR2 from "./sentinel-gr2.js";

export default async function runGR3() {
  console.log("[GR3] Running Full Audit...");
  await runGR1();
  await runGR2();
  console.log("[GR3] Full Audit Complete.");
}
