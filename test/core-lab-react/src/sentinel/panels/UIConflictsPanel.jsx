// ============================================================
// UIConflictsPanel.jsx — Sentinel v2.0 UI Conflict Viewer
// ============================================================

import { useEffect, useState, useRef } from "react";
import "../styles/sentinel-panels.css";

export default function UIConflictsPanel() {
  // ------------------------------------------------------------
  // Visibility Toggle (SHIFT + S)
  // ------------------------------------------------------------
  const [visible, setVisible] = useState(false); // default: hidden on live site

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
  // Data Fetch (FIXED — no .js suffix)
  // ------------------------------------------------------------
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5175/sentinel/ui-conflicts") // FIXED
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
          top: "20%",
          left: "20%",
          zIndex: 999999
        }}
      >
        Loading...
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
          top: "20%",
          left: "20%",
          zIndex: 999999
        }}
      >
        <h2>UI Conflicts</h2>
        <p>Error loading UI conflict data.</p>
      </div>
    );
  }

  const { legacyActive, labActive, coreActive, cssConflicts, componentConflicts } = data;

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
        top: "20%",
        left: "20%",
        zIndex: 999999
      }}
    >
      <h2>UI Conflicts</h2>

      <div className="row">
        <span>Legacy Active:</span>
        <strong>{legacyActive.length}</strong>
      </div>

      <div className="row">
        <span>Lab Active:</span>
        <strong>{labActive.length}</strong>
      </div>

      <div className="row">
        <span>Core Active:</span>
        <strong>{coreActive.length}</strong>
      </div>

      <div className="row">
        <span>CSS Conflicts:</span>
        <strong>{cssConflicts.length}</strong>
      </div>

      <div className="row">
        <span>Component Conflicts:</span>
        <strong>{componentConflicts.length}</strong>
      </div>

      {legacyActive.length > 0 && (
        <div className="detail-block">
          <h3>Legacy Active</h3>
          {legacyActive.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {labActive.length > 0 && (
        <div className="detail-block">
          <h3>Lab Active</h3>
          {labActive.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {cssConflicts.length > 0 && (
        <div className="detail-block">
          <h3>CSS Conflicts</h3>
          {cssConflicts.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {componentConflicts.length > 0 && (
        <div className="detail-block">
          <h3>Component Conflicts</h3>
          {componentConflicts.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
