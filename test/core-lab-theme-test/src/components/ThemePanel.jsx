// ============================================================
// ThemePanel.jsx — Admin Console (Draggable + Visual Swatches)
// ============================================================

import React, { useEffect, useState, useRef } from "react";

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
    // Save admin choice
    localStorage.setItem(`theme-${mode}`, gradient);

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

    // Load correct background on mount
    if (current === "day" && day) {
      document.body.style.background = day;
    }
    if (current === "dark" && night) {
      document.body.style.background = night;
    }

    // React to theme changes
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
      <div
        className="theme-panel-inner"
        ref={panelRef}
        onMouseDown={startDrag}
      >
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

            {/* ============================
                DAY SWATCHES
               ============================ */}
            <h3>Day Themes</h3>
            <div className="theme-swatches">
              {daySwatches.map((g, i) => (
                <button
                  key={i}
                  onClick={() => applySwatch("day", g)}
                  style={{ background: g }}
                  className="swatch-btn"
                />
              ))}
            </div>

            {/* ============================
                NIGHT SWATCHES
               ============================ */}
            <h3>Night Themes</h3>
            <div className="theme-swatches">
              {nightSwatches.map((g, i) => (
                <button
                  key={i}
                  onClick={() => applySwatch("dark", g)}
                  style={{ background: g }}
                  className="swatch-btn"
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

// ============================================================
// Gradient Libraries — Cinematic Day + Night Themes
// ============================================================

const daySwatches = [
  "radial-gradient(circle at top, #ffffff 0%, #f2f2f2 40%, #e6e6e6 100%)",
  "radial-gradient(circle at top, #fff7e6 0%, #ffe0b3 40%, #ffc266 100%)",
  "radial-gradient(circle at top, #ffe5d9 0%, #ffc9b9 40%, #ffb3a1 100%)",
  "radial-gradient(circle at top, #e8f6ff 0%, #cdeaff 40%, #b3ddff 100%)",
  "radial-gradient(circle at top, #f8fff8 0%, #d6ffd6 40%, #b3ffb3 100%)",
  "radial-gradient(circle at top, #fff4cc 0%, #ffe699 40%, #ffdb66 100%)",
  "radial-gradient(circle at top, #ffe6f2 0%, #ffcce6 40%, #ffb3d9 100%)",
  "radial-gradient(circle at top, #f7f7f7 0%, #eaeaea 40%, #dcdcdc 100%)",
  "radial-gradient(circle at top, #f3e8ff 0%, #e6ccff 40%, #d9b3ff 100%)",
];

const nightSwatches = [
  "radial-gradient(circle at top, #1a1a2f 0%, #050510 40%, #000000 100%)",
  "radial-gradient(circle at top, #2b1f55 0%, #120a33 40%, #050510 100%)",
  "radial-gradient(circle at top, #1a2a55 0%, #0f1a33 40%, #050510 100%)",
  "radial-gradient(circle at top, #443366 0%, #221a44 40%, #0a0822 100%)",
  "radial-gradient(circle at top, #331a1a 0%, #1a0f0f 40%, #0a0505 100%)",
  "radial-gradient(circle at top, #0f2f2f 0%, #0a1f1f 40%, #051010 100%)",
  "radial-gradient(circle at top, #1a1a55 0%, #0f0f33 40%, #050510 100%)",
  "radial-gradient(circle at top, #1a0f2f 0%, #0f0a22 40%, #050510 100%)",
];
