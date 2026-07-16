const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async function runGR1() {
  console.log("[GR1] Running Sentinel Handshake...");

  const dev = "http://localhost:5173";
  const prod = "https://www.crowncreatives.uk";

  const devRes = await axios.get(dev).catch(() => null);
  const prodRes = await axios.get(prod).catch(() => null);

  const report = {
    timestamp: new Date().toISOString(),
    dev: {
      status: devRes?.status || 0,
      ok: !!devRes,
      bodyLength: devRes?.data?.length || 0
    },
    prod: {
      status: prodRes?.status || 0,
      ok: !!prodRes,
      bodyLength: prodRes?.data?.length || 0
    },
    compare: {
      statusMatch: devRes?.status === prodRes?.status,
      okMatch: !!devRes && !!prodRes,
      bodySizeDelta: Math.abs((devRes?.data?.length || 0) - (prodRes?.data?.length || 0))
    }
  };

  const outPath = path.join(__dirname, "sentinel-snapshots", `GR1-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log("[GR1] Snapshot written:", outPath);
};
