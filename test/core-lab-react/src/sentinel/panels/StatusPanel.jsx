// ============================================================
// StatusPanel.jsx — Sentinel v2.0 Status Diagnostics
// ============================================================

import { useEffect, useState, useRef } from "react";
import "../styles/sentinel-panels.css";

export default function StatusPanel() {
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
    fetch("http://localhost:5175/sentinel/status")
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
          top: "10%",
          left: "10%",
          zIndex: 999999
        }}
      >
        Loading status...
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
          top: "10%",
          left: "10%",
          zIndex: 999999
        }}
      >
        <h2>Status</h2>
        <p>Error loading status diagnostics.</p>
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
        top: "10%",
        left: "10%",
        zIndex: 999999
      }}
    >
      <h2>Status Diagnostics</h2>

      <div className="row">
        <span>Environment:</span>
        <strong>{data.environment}</strong>
      </div>

      <div className="row">
        <span>Version:</span>
        <strong>{data.version}</strong>
      </div>

      <div className="row">
        <span>Uptime:</span>
        <strong>{data.uptime}</strong>
      </div>

      <div className="row">
        <span>Checks Passed:</span>
        <strong>{data.passed}</strong>
      </div>

      <div className="row">
        <span>Checks Failed:</span>
        <strong>{data.failed}</strong>
      </div>

      {data.errors?.length > 0 && (
        <div className="detail-block">
          <h3>Errors</h3>
          {data.errors.map((err, i) => (
            <div className="row" key={i}>{err}</div>
          ))}
        </div>
      )}
    </div>
  );
}
