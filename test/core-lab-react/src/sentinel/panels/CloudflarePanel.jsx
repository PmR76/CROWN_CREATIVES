// ============================================================
// CloudflarePanel.jsx — Sentinel v2.0 Cloudflare Diagnostics
// ============================================================

import { useEffect, useState } from "react";
import "../styles/sentinel-panels.css";

export default function CloudflarePanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5175/sentinel/cloudflare")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => setData({ error: true }));
  }, []);

  if (!data) return <div className="sentinel-panel loading">Loading...</div>;

  if (data.error) {
    return (
      <div className="sentinel-panel status-red">
        <h2>Cloudflare</h2>
        <p>Error loading Cloudflare diagnostics.</p>
      </div>
    );
  }

  return (
    <div className="sentinel-panel">
      <h2>Cloudflare Diagnostics</h2>

      {data.map((line, i) => (
        <div className="row" key={i}>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}
