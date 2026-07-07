// ============================================================
// ThemePanel.jsx — Admin Console (Draggable + Visual Swatches)
// ============================================================

import React, { useEffect, useState, useRef } from "react";
import "../styles/theme-panel.css";

// ============================================================
// Gradient Libraries — Cinematic Day + Night Themes
// ============================================================

const daySwatches = [
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ffe29f 0%, #ffa99f 48%, #ff719a 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)",
  "linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)",
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(135deg, #f6f0c4 0%, #f4d7a7 100%)"
];

const nightSwatches = [
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  "linear-gradient(135deg, #000428 0%, #004e92 100%)",
  "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
  "linear-gradient(135deg, #16222a 0%, #3a6073 100%)",
  "linear-gradient(135deg, #000000 0%, #434343 100%)"
];

// ============================================================
// Component
// ============================================================

export default function ThemePanel() {
  const [visible, setVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const panelRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // ============================================================
  // SHIFT + A toggles panel visibility
  // ============================================================
  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "a" && e.shiftKey) {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ============================================================
  // Admin unlock
  // ============================================================
  const unlock = () => {
    if (password === "Crown26") {
      setAuthenticated(true);
    }
  };

  // ============================================================
  // Dragging logic
  // ============================================================
  const startDrag = (e) => {
    const panel = panelRef.current;
    dragOffset.current = {
      x: e.clientX - panel.offsetLeft,
      y: e.clientY - panel.offsetTop,
    };
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", stopDrag);
  };

  const dragMove = (e) => {
    const panel = panelRef.current;
    panel.style.left = `${e.clientX - dragOffset.current.x}px`;
    panel.style.top = `${e.clientY - dragOffset.current.y}px`;
  };

  const stopDrag = () => {
    window.removeEventListener("mousemove", dragMove);
    window.removeEventListener("mouseup", stopDrag);
  };

  // ============================================================
  // Apply swatch (Day or Night)
  // ============================================================
  const applySwatch = (mode, gradient) => {
    localStorage.setItem(`theme-${mode}`, gradient);

    // Update CSS variables
    if (mode === "day") {
      document.body.style.setProperty("--day-bg", gradient);
    } else {
      document.body.style.setProperty("--night-bg", gradient);
    }

    // Apply immediately if current theme matches
    const current = document.body.dataset.theme || "day";
    if (current === mode) {
      document.body.style.background = gradient;
    }
  };

  // ============================================================
  // Load saved theme on mount + react to theme changes
  // ============================================================
  useEffect(() => {
    const day = localStorage.getItem("theme-day");
    const night = localStorage.getItem("theme-dark");
    const current = document.body.dataset.theme || "day";

    if (day) document.body.style.setProperty("--day-bg", day);
    if (night) document.body.style.setProperty("--night-bg", night);

    if (current === "day" && day) {
      document.body.style.background = day;
    }
    if (current === "dark" && night) {
      document.body.style.background = night;
    }

    window.addEventListener("theme-set", (e) => {
      const mode = e.detail;
      const day = localStorage.getItem("theme-day");
      const night = localStorage.getItem("theme-dark");

      if (mode === "day" && day) {
        document.body.style.background = day;
      }
      if (mode === "dark" && night) {
        document.body.style.background = night;
      }
    });
  }, []);

  // ============================================================
  // Panel hidden?
  // ============================================================
  if (!visible) return null;

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="theme-panel">
      <div className="theme-panel-inner" ref={panelRef} onMouseDown={startDrag}>
        {!authenticated && (
          <>
            <h2>Admin Login</h2>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="theme-password"
            />
            <button onClick={unlock} className="theme-login-btn">
              Unlock
            </button>
            <p>Press SHIFT+A to close.</p>
          </>
        )}

        {authenticated && (
          <>
            <h2>Theme Swatches</h2>

            {/* ============================ DAY SWATCHES ============================ */}
            <h3>Day Themes</h3>
            <div className="theme-swatches">
              {daySwatches.map((g, i) => (
                <button
                  key={i}
                  onClick={() => applySwatch("day", g)}
                  style={{ background: g }}
                  className={`swatch-btn ${
                    localStorage.getItem("theme-day") === g ? "selected" : ""
                  }`}
                />
              ))}
            </div>

            {/* ============================ NIGHT SWATCHES ============================ */}
            <h3>Night Themes</h3>
            <div className="theme-swatches">
              {nightSwatches.map((g, i) => (
                <button
                  key={i}
                  onClick={() => applySwatch("dark", g)}
                  style={{ background: g }}
                  className={`swatch-btn ${
                    localStorage.getItem("theme-dark") === g ? "selected" : ""
                  }`}
                />
              ))}
            </div>

            <p>Press SHIFT+A to close.</p>
          </>
        )}
      </div>
    </div>
  );
}
