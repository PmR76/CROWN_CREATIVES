// ============================================================
// CROWN CREATIVES — THEME PANEL (GR1 CLEAN)
// Draggable • SHIFT+A Toggle • Gradient Swatches • Day/Night
// ============================================================

import { useEffect, useState } from "react";
import "../styles/theme-panel.css";
import { themeEngine } from "../theme/ThemeEngine";

export default function ThemePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("day");
  const [key, setKey] = useState("sunrise");

  // ------------------------------------------------------------
  // SHIFT + A — Toggle Panel
  // ------------------------------------------------------------
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "A" && e.shiftKey) {
        setIsOpen(prev => !prev);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ------------------------------------------------------------
  // Draggable Panel
  // ------------------------------------------------------------
  useEffect(() => {
    const panel = document.getElementById("themePanel");
    if (!panel) return;

    const header = panel.querySelector(".theme-panel-header");
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function onMouseDown(e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      document.body.style.userSelect = "none";
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = `${initialLeft + dx}px`;
      panel.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.body.style.userSelect = "";
    }

    header.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      header.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // ------------------------------------------------------------
  // Gradient Swatches (36+)
  // ------------------------------------------------------------
  const gradientKeys = [
    "sunrise", "sunset", "dusk", "dawn", "neon", "aqua", "forest",
    "gold", "purple", "crimson", "ocean", "sky", "mint", "lava",
    "peach", "rose", "violet", "steel", "nightfall", "midnight",
    "storm", "ember", "ice", "sand", "crown", "royal", "emerald",
    "blush", "shadow", "plasma", "nova", "flare", "aurora", "zen"
  ];

  // ------------------------------------------------------------
  // Apply Theme
  // ------------------------------------------------------------
  function applyTheme() {
    themeEngine.setBackgroundTheme(role, key);
  }

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div
      id="themePanel"
      className={`theme-panel ${isOpen ? "open" : ""}`}
    >
      <div className="theme-panel-header">
        Theme Panel — SHIFT + A
      </div>

      <div className="theme-panel-body">

        {/* ROLE SELECTOR */}
        <div className="theme-section">
          <div className="theme-label">Mode</div>
          <div className="theme-role-buttons">
            <button
              className={role === "day" ? "active" : ""}
              onClick={() => setRole("day")}
            >
              Day
            </button>
            <button
              className={role === "night" ? "active" : ""}
              onClick={() => setRole("night")}
            >
              Night
            </button>
          </div>
        </div>

        {/* SWATCH GRID */}
        <div className="theme-section">
          <div className="theme-label">Gradients</div>
          <div className="swatch-grid">
            {gradientKeys.map((g) => (
              <div
                key={g}
                className={`swatch ${key === g ? "selected" : ""}`}
                style={{
                  background: `var(--grad-${g})`
                }}
                onClick={() => setKey(g)}
              >
                {g}
              </div>
            ))}
          </div>
        </div>

        {/* APPLY BUTTON */}
        <div className="theme-section">
          <button className="apply-btn" onClick={applyTheme}>
            Apply Theme
          </button>
        </div>

      </div>
    </div>
  );
}
