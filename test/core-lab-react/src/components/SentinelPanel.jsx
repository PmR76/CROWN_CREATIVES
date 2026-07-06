// ============================================================
// SentinelPanel.jsx — Core-Lab Fault Matrix UI (FINAL VERSION)
// ============================================================

import React, { useEffect, useState } from "react";
import { runCoreLabChecks } from "../sentinel/sentinel-corelab-checks";
import "../styles/corepanel.css";

export default function SentinelPanel() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const output = runCoreLabChecks();
    setResults(output);
  }, []);

  function statusColor(status) {
    return status === "PASS" ? "sentinel-pass" : "sentinel-fail";
  }

  return (
    <div className="sentinel-panel">
      <h2 className="sentinel-title">Sentinel — Core-Lab Fault Matrix</h2>

      <div className="sentinel-section">
        <h3>Level 1 — CRITICAL (App will NOT run)</h3>
        {results.slice(0, 9).map((r) => (
          <div key={r.name} className={`sentinel-row ${statusColor(r.status)}`}>
            <span className="sentinel-check">{r.name}</span>
            <span className="sentinel-status">{r.status}</span>
          </div>
        ))}
      </div>

      <div className="sentinel-section">
        <h3>Level 2 — MAJOR (UI loads but features fail)</h3>
        {results.slice(9, 15).map((r) => (
          <div key={r.name} className={`sentinel-row ${statusColor(r.status)}`}>
            <span className="sentinel-check">{r.name}</span>
            <span className="sentinel-status">{r.status}</span>
          </div>
        ))}
      </div>

      <div className="sentinel-section">
        <h3>Level 3 — MINOR (Cosmetic / optional)</h3>
        {results.slice(15).map((r) => (
          <div key={r.name} className={`sentinel-row ${statusColor(r.status)}`}>
            <span className="sentinel-check">{r.name}</span>
            <span className="sentinel-status">{r.status}</span>
          </div>
        ))}
      </div>

      <div className="sentinel-summary">
        <h3>Summary</h3>
        {results.some((r) => r.status === "FAIL") ? (
          <p className="sentinel-summary-fail">
            ❌ Sentinel has detected faults.  
            Review the FAIL items above to identify the exact cause.
          </p>
        ) : (
          <p className="sentinel-summary-pass">
            ✅ All systems operational.  
            Core-Lab React is functioning correctly.
          </p>
        )}
      </div>
    </div>
  );
}
