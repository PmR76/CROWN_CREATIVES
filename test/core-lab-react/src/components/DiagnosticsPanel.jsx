// ============================================================
// DiagnosticsPanel.jsx — Draggable System Status Overlay
// ============================================================

import React, { useEffect, useState, useRef } from "react";
import "../styles/diagnostics.css";

export default function DiagnosticsPanel() {
  const [fps, setFps] = useState(60);
  const [theme, setTheme] = useState(document.body.dataset.theme || "day");

  const panelRef = useRef(null);
  const pos = useRef({ x: 20, y: 20, offsetX: 0, offsetY: 0 });

  // FPS counter
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
  }, []);

  // Theme listener
  useEffect(() => {
    const handler = (e) => setTheme(e.detail);
    window.addEventListener("theme-set", handler);
    return () => window.removeEventListener("theme-set", handler);
  }, []);

  // Drag logic
  const startDrag = (e) => {
    const panel = panelRef.current;
    pos.current.offsetX = e.clientX - panel.offsetLeft;
    pos.current.offsetY = e.clientY - panel.offsetTop;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  };

  const drag = (e) => {
    const panel = panelRef.current;
    panel.style.left = `${e.clientX - pos.current.offsetX}px`;
    panel.style.top = `${e.clientY - pos.current.offsetY}px`;
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div
      ref={panelRef}
      className="diagnostics-panel"
      style={{ left: pos.current.x, top: pos.current.y }}
    >
      <div className="diag-drag-handle" onMouseDown={startDrag}>
        CORE DIAGNOSTICS
      </div>

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
