// ============================================================
// AdminPanel.jsx — Draggable OS Window + 60 Swatches + Live Preview
// ============================================================

import React, { useEffect, useRef } from "react";
import { useAdmin } from "./AdminContext";

export default function AdminPanel({
  cardsConfig,
  setCardsConfig,
  tickerText,
  setTickerText,
  gradients,
  currentTheme,
  setCurrentTheme
}) {
  // ⭐ NEW: Panel open/close toggle from context
  const { isAdmin, isPanelOpen, setIsPanelOpen } = useAdmin();

  // ⭐ Only render when admin + panel open
  if (!isAdmin || !isPanelOpen) return null;

  const panelRef = useRef(null);
  const dragHandleRef = useRef(null);

  // ------------------------------------------------------------
  // SHIFT + A toggles AdminPanel open/closed
  // ------------------------------------------------------------
  useEffect(() => {
    function onKey(e) {
      if (e.key === "A" && e.shiftKey) {
        setIsPanelOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ------------------------------------------------------------
  // DRAG LOGIC — Only header is draggable
  // ------------------------------------------------------------
  useEffect(() => {
    const el = panelRef.current;
    const handle = dragHandleRef.current;
    if (!el || !handle) return;

    let pos = { x: 0, y: 0 };

    function onMouseDown(e) {
      e.preventDefault();
      pos.x = e.clientX;
      pos.y = e.clientY;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      pos.x = e.clientX;
      pos.y = e.clientY;

      el.style.left = el.offsetLeft + dx + "px";
      el.style.top = el.offsetTop + dy + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    handle.addEventListener("mousedown", onMouseDown);

    return () => handle.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ------------------------------------------------------------
  // LIVE PREVIEW — Hovering a swatch previews background
  // ------------------------------------------------------------
  function previewTheme(preview) {
    document.body.style.background = preview;
  }

  // ------------------------------------------------------------
  // APPLY THEME — Clicking a swatch sets the theme
  // ------------------------------------------------------------
  function applyTheme(id, preview) {
    setCurrentTheme(id);
    localStorage.setItem("currentTheme", id);
    document.body.style.background = preview;
  }

  // ------------------------------------------------------------
  // SAVE BUTTON — Saves cards + ticker
  // ------------------------------------------------------------
  function saveAll() {
    localStorage.setItem("cardsConfig", JSON.stringify(cardsConfig));
    localStorage.setItem("tickerText", tickerText);
    alert("Saved!");
  }

  // ------------------------------------------------------------
  // RENDER — Centered + draggable
  // ------------------------------------------------------------
  return (
    <div
      ref={panelRef}
      className="admin-panel"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // ⭐ Center window
        width: "480px",
        maxHeight: "80vh",
        overflowY: "auto",
        zIndex: 999999,
        background: "rgba(20,20,30,0.92)",
        borderRadius: "16px",
        backdropFilter: "blur(18px)",
        boxShadow: "0 0 40px rgba(0,0,0,0.6)"
      }}
    >
      {/* ⭐ DRAG HANDLE */}
      <div
        ref={dragHandleRef}
        style={{
          padding: "14px",
          background: "rgba(255,255,255,0.08)",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          cursor: "move",
          fontWeight: "700",
          letterSpacing: "1px",
          textAlign: "center"
        }}
      >
        Crown Creatives — Admin Panel
      </div>

      <div style={{ padding: "20px" }}>
        {/* ============================================================
            SWATCH GRID — 60 swatches (30 day + 30 night)
        ============================================================ */}
        <h3 className="admin-section-title">Theme Swatches</h3>
        <p className="admin-section-subtitle">
          Hover to preview • Click to apply
        </p>

        <div className="swatch-grid">
          {gradients.map((g, i) => (
            <button
              key={i}
              className={`swatch ${currentTheme === g.id ? "active" : ""}`}
              style={{ background: g.preview }}
              onMouseEnter={() => previewTheme(g.preview)}
              onClick={() => applyTheme(g.id, g.preview)}
            />
          ))}
        </div>

        {/* ============================================================
            EDITABLE CARDS
        ============================================================ */}
        <h3 className="admin-section-title">Frosted Cards</h3>

        {cardsConfig.map((text, index) => (
          <label key={index} className="admin-label">
            Card {index + 1}
            <input
              className="admin-input"
              value={cardsConfig[index]}
              onChange={(e) => {
                const updated = [...cardsConfig];
                updated[index] = e.target.value;
                setCardsConfig(updated);
              }}
            />
          </label>
        ))}

        {/* ============================================================
            TICKER TEXT
        ============================================================ */}
        <h3 className="admin-section-title">Ticker Text</h3>

        <input
          className="admin-input"
          value={tickerText}
          onChange={(e) => setTickerText(e.target.value)}
        />

        {/* ============================================================
            SAVE BUTTON
        ============================================================ */}
        <button className="admin-save-button" onClick={saveAll}>
          Save All
        </button>
      </div>
    </div>
  );
}
