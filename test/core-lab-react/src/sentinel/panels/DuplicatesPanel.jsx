// ============================================================
// DuplicatesPanel.jsx — Sentinel v2.0 Duplicate Asset Scanner
// ============================================================

import { useEffect, useState, useRef } from "react";
import "../styles/sentinel-panels.css";

export default function DuplicatesPanel() {
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
    fetch("http://localhost:5175/sentinel/duplicates")
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
          top: "30%",
          left: "30%",
          zIndex: 999999
        }}
      >
        Scanning for duplicates...
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
          top: "30%",
          left: "30%",
          zIndex: 999999
        }}
      >
        <h2>Duplicates</h2>
        <p>Error loading duplicate scan.</p>
      </div>
    );
  }

  const { cssDuplicates, assetDuplicates, componentDuplicates } = data;

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
        top: "30%",
        left: "30%",
        zIndex: 999999
      }}
    >
      <h2>Duplicate Scanner</h2>

      <div className="row">
        <span>CSS Duplicates:</span>
        <strong>{cssDuplicates.length}</strong>
      </div>

      <div className="row">
        <span>Asset Duplicates:</span>
        <strong>{assetDuplicates.length}</strong>
      </div>

      <div className="row">
        <span>Component Duplicates:</span>
        <strong>{componentDuplicates.length}</strong>
      </div>

      {cssDuplicates.length > 0 && (
        <div className="detail-block">
          <h3>CSS Duplicates</h3>
          {cssDuplicates.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {assetDuplicates.length > 0 && (
        <div className="detail-block">
          <h3>Asset Duplicates</h3>
          {assetDuplicates.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {componentDuplicates.length > 0 && (
        <div className="detail-block">
          <h3>Component Duplicates</h3>
          {componentDuplicates.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
