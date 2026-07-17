// ============================================================
// StatusPanel.jsx — Sentinel v2.0 Status Panel
// ============================================================

import { useEffect, useState } from "react";
import "../styles/sentinel-panels.css";

export default function StatusPanel() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5175/sentinel/status")
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus({ error: true }));
  }, []);

  if (!status) return <div className="sentinel-panel loading">Loading...</div>;

  return (
    <div className={`sentinel-panel status-${status.status}`}>
      <h2>Sentinel Status</h2>

      <div className="row">
        <span>Environment:</span>
        <strong>{status.env}</strong>
      </div>

      <div className="row">
        <span>HTTP Status:</span>
        <strong>{status.status}</strong>
      </div>

      <div className="row">
        <span>OK:</span>
        <strong>{status.ok ? "Yes" : "No"}</strong>
      </div>

      <div className="row">
        <span>Duration:</span>
        <strong>{status.durationMs}ms</strong>
      </div>

      <div className="row">
        <span>Body Size:</span>
        <strong>{status.bodyLength} bytes</strong>
      </div>

      <div className="row">
        <span>Timestamp:</span>
        <strong>{status.timestamp}</strong>
      </div>
    </div>
  );
}
