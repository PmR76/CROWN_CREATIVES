// ============================================================
// CloudflarePanel.jsx — Sentinel v2.0 Cloudflare Diagnostics
// ============================================================

import { useEffect, useState, useRef } from "react";
import "../styles/sentinel-panels.css";

export default function CloudflarePanel() {
  // ------------------------------------------------------------
  // Visibility Toggle (SHIFT + S)
  // ------------------------------------------------------------
  const [visible, setVisible] = useState(false); // ⭐ start hidden on live

  useEffect(() => {
    function toggle(e) {
      if (e.key === "S" && e.shiftKey) {
        setVisible(v => !v);
      }
    }
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, []);

  if (!visible) return null;

  // ------------------------------------------------------------
  // Draggable Panel
  // ------------------------------------------------------------
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  function onMouseDown(e) {
    setDragging(true);
    setOffset({
      x: e.clientX - panelRef.current.offsetLeft,
      y: e.clientY - panelRef.current.offsetTop
    });
  }

  function onMouseMove(e) {
    if (!dragging) return;
    panelRef.current.style.left = `${e.clientX - offset.x}px`;
    panelRef.current.style.top = `${e.clientY - offset.y}px`;
  }

  function onMouseUp() {
    setDragging(false);
  }

  // ------------------------------------------------------------
  // Data Fetch (correct endpoint)
  // ------------------------------------------------------------
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5175/sentinel/cloudflare")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => setData({ error: true }));
  }, []);

  // ------------------------------------------------------------
  // Loading / Error States
  // ------------------------------------------------------------
  if (!data) {
    return (
      <div
        ref={panelRef}
        className="sentinel-panel loading"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          position: "fixed",
          top: "25%",
          left: "25%",
          zIndex: 999999
        }}
      >
        Loading Cloudflare diagnostics...
      </div>
    );
  }

  if (data.error) {
    return (
      <div
        ref={panelRef}
        className="sentinel-panel status-red"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          position: "fixed",
          top: "25%",
          left: "25%",
          zIndex: 999999
        }}
      >
        <h2>Cloudflare</h2>
        <p>Error loading Cloudflare diagnostics.</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Render Panel
  // ------------------------------------------------------------
  return (
    <div
      ref={panelRef}
      className="sentinel-panel"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        position: "fixed",
        top: "25%",
        left: "25%",
        zIndex: 999999
      }}
    >
      <h2>Cloudflare Diagnostics</h2>

      {data.map((line, i) => (
        <div className="row" key={i}>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}
