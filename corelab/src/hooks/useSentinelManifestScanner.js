import { useEffect, useState } from "react";

export default function useSentinelManifestScanner() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    async function runScan() {
      try {
        const res = await fetch("/sentinel-scan");
        const json = await res.json();
        setResults(json);
      } catch (err) {
        console.error("Sentinel scan failed:", err);
      }
    }

    runScan();
  }, []);

  return results;
}
