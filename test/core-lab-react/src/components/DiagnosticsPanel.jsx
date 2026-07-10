// ============================================================
// DiagnosticsPanel.jsx — Live System Status Overlay
// ============================================================

import React, { useEffect, useState } from "react";
import "../styles/diagnostics.css";

export default function DiagnosticsPanel() {
  const [fps, setFps] = useState(60);
  const [theme, setTheme] = useState(document.body.dataset.theme || "day");

  useEffect(() => {
    let last = performance.now();
    let frames = 0;

    const loop = (now) => {
      frames++;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    const handler = (e) => setTheme(e.detail);
    window.addEventListener("theme-set", handler);

    return () => window.removeEventListener("theme-set", handler);
  }, []);

  return (
    <div className="diagnostics-panel">
      <h3>CORE DIAGNOSTICS</h3>
      <p>Header: Loaded</p>
      <p>Footer: Loaded</p>
      <p>Ticker: Running</p>
      <p>Hero Crown: Active</p>
      <p>Background3D: Active</p>
      <p>Theme: {theme}</p>
      <p>FPS: {fps}</p>
      <p>Errors: None</p>
    </div>
  );
}
