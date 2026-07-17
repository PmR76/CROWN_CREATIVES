// ============================================================
// HandshakePanel.jsx — Sentinel v2.0 Handshake Panel
// ============================================================

import { useEffect, useState } from "react";
import "../styles/sentinel-panels.css";

export default function HandshakePanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5175/sentinel/handshake")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => setData({ error: true }));
  }, []);

  if (!data) return <div className="sentinel-panel loading">Loading...</div>;

  return (
    <div className="sentinel-panel">
      <h2>Handshake</h2>

      <div className="row">
        <span>Status Match:</span>
        <strong>{data.statusMatch ? "Yes" : "No"}</strong>
      </div>

      <div className="row">
        <span>OK Match:</span>
        <strong>{data.okMatch ? "Yes" : "No"}</strong>
      </div>

      <div className="row">
        <span>Body Size Δ:</span>
        <strong>{data.bodySizeDelta} bytes</strong>
      </div>
    </div>
  );
}
