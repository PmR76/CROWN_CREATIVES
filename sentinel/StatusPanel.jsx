import { useEffect, useState } from "react";
import "./status-panel.css";

export default function StatusPanel() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5175/sentinel/status")
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus({ error: true }));
  }, []);

  if (!status) return <div className="panel loading">Loading...</div>;

  return (
    <div className={`panel status-panel ${status.status}`}>
      <h2>Sentinel Status</h2>

      <div className="status-row">
        <span>Environment:</span>
        <strong>{status.env}</strong>
      </div>

      <div className="status-row">
        <span>HTTP Status:</span>
        <strong>{status.status}</strong>
      </div>

      <div className="status-row">
        <span>OK:</span>
        <strong>{status.ok ? "Yes" : "No"}</strong>
      </div>

      <div className="status-row">
        <span>Duration:</span>
        <strong>{status.durationMs}ms</strong>
      </div>

      <div className="status-row">
        <span>Body Size:</span>
        <strong>{status.bodyLength} bytes</strong>
      </div>

      <div className="status-row">
        <span>Timestamp:</span>
        <strong>{status.timestamp}</strong>
      </div>
    </div>
  );
}
