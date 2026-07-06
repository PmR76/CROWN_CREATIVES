// ============================================================
// ThemePanel.jsx — Crown Creatives Theme System (FINAL FIXED)
// SHIFT + A • Password Gate • Draggable • Gradient Swatches
// ============================================================

console.log("ThemePanel mounted");


import { useEffect, useState, useRef } from "react";
import "../styles/theme-panel.css";
import { themeEngine } from "../theme/ThemeEngine";

export default function ThemePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState("day");        // unified theme mode
  const [gradient, setGradient] = useState("sunrise");
  const [password, setPassword] = useState("");

  // Ref for draggable panel
  const panelRef = useRef(null);

  // ------------------------------------------------------------
  // SHIFT + A — Open Panel (password gate)
  // ------------------------------------------------------------
  useEffect(() => {
    function handleKey(e) {
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ------------------------------------------------------------
  // Admin Unlock
  // ------------------------------------------------------------
  function handleUnlock() {
    if (password === "CROWN26") {
      setIsAdmin(true);
    } else {
      alert("Incorrect password.");
    }
  }

  // ------------------------------------------------------------
  // Apply Theme (Unified Layer 3 API)
  // ------------------------------------------------------------
  function applyTheme() {
    themeEngine.setBackgroundTheme(role, gradient);

    // Fire unified theme event for React + diagnostics
    window.dispatchEvent(
      new CustomEvent("theme-set", { detail: role })
    );
  }

  // ------------------------------------------------------------
  // Draggable Panel — SAFE (runs only after mount)
  // ------------------------------------------------------------
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const header = panel.querySelector(".theme-panel-header");
    if (!header) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function onMouseDown(e) {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      document.body.style.userSelect = "none";
    }

    function onMouseMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = `${initialLeft + dx}px`;
      panel.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      dragging = false;
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
  }, [isOpen]);

  // ------------------------------------------------------------
  // Gradient Keys
  // ------------------------------------------------------------
  const gradientKeys = [
    "sunrise","sunset","dusk","dawn","neon","aqua","forest",
    "gold","purple","crimson","ocean","sky","mint","lava",
    "peach","rose","violet","steel","nightfall","midnight",
    "storm","ember","ice","sand","crown","royal","emerald",
    "blush","shadow","plasma","nova","flare","aurora","zen"
  ];

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  if (!isOpen) return null;

  return (
    <div
      id="themePanel"
      ref={panelRef}
      className={`theme-panel ${isOpen ? "open" : ""}`}
    >
      <div className="theme-panel-header">Theme Panel — SHIFT + A</div>

      <div className="theme-panel-body">

        {/* ADMIN GATE */}
        {!isAdmin && (
          <div className="theme-section">
            <div className="theme-label">Admin Access</div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="apply-btn" onClick={handleUnlock}>
              Unlock
            </button>
          </div>
        )}

        {/* MAIN PANEL */}
        {isAdmin && (
          <>
            {/* MODE SELECTOR */}
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
                  className={role === "dark" ? "active" : ""}
                  onClick={() => setRole("dark")}
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
                    className={`swatch ${gradient === g ? "selected" : ""}`}
                    style={{ background: `var(--grad-${g})` }}
                    onClick={() => setGradient(g)}
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

            {/* CLOSE BUTTON */}
            <div className="theme-section">
              <button className="apply-btn" onClick={() => setIsOpen(false)}>
                Close Panel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
