import axios from "axios";
import fs from "fs";
import path from "path";

const ROUTES = [
  "/", "/about", "/gallery", "/projects", "/videos",
  "/podcast", "/blog", "/contact"
];

export default async function runGR2() {
  console.log("[GR2] Running Deep Scan...");

  const prod = "https://www.crowncreatives.uk";
  const results = [];

  for (const route of ROUTES) {
    const url = prod + route;
    console.log(`[GR2] Checking ${url}`);

    const res = await axios.get(url).catch(() => null);

    results.push({
      route,
      status: res?.status || 0,
      ok: !!res,
      bodyLength: res?.data?.length || 0
    });
  }

  const report = {
    timestamp: new Date().toISOString(),
    prod: results,
    summary: {
      healthyRoutes: results.filter(r => r.ok).length,
      failingRoutes: results.filter(r => !r.ok).length
    }
  };

  const outPath = path.join(path.resolve(), "sentinel-snapshots", `GR2-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log("[GR2] Snapshot written:", outPath);
}
