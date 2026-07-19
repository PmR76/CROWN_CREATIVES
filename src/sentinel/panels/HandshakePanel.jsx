// ============================================================
// HandshakePanel.jsx — Sentinel v2.0 Handshake Diagnostics
// ============================================================

import { useEffect, useState, useRef } from "react";
import "../styles/sentinel-panels.css";

export default function HandshakePanel() {
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
    fetch("http://localhost:5175/sentinel/handshake")
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
          top: "15%",
          left: "15%",
          zIndex: 999999
        }}
      >
        Loading handshake diagnostics...
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
          top: "15%",
          left: "15%",
          zIndex: 999999
        }}
      >
        <h2>Handshake</h2>
        <p>Error loading handshake diagnostics.</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Render Panel (updated to match Watchkeeper JSON)
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
        top: "15%",
        left: "15%",
        zIndex: 999999
      }}
    >
      <h2>Sentinel Handshake</h2>

      <div className="row">
        <span>Status Match:</span>
        <strong>{data.statusMatch ? "Yes" : "No"}</strong>
      </div>

      <div className="row">
        <span>OK Match:</span>
        <strong>{data.okMatch ? "Yes" : "No"}</strong>
      </div>

      <div className="row">
        <span>Body Size Delta:</span>
        <strong>{data.bodySizeDelta}</strong>
      </div>

      <div className="row">
        <span>Timestamp:</span>
        <strong>{data.timestamp}</strong>
      </div>
    </div>
  );
}
