// ============================================================
// ThemePanel.jsx — Admin Console (Draggable + Visual Swatches)
// ============================================================

import React, { useEffect, useState, useRef } from "react";
import "../styles/theme-panel.css";

// ============================================================
// Gradient Libraries — Cinematic Day + Night Themes (30 each)
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
  "linear-gradient(135deg, #f6f0c4 0%, #f4d7a7 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
  "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
  "linear-gradient(135deg, #fffcdf 0%, #ffefc1 100%)",
  "linear-gradient(135deg, #ffe6fa 0%, #fcd1ff 100%)",
  "linear-gradient(135deg, #fff5f7 0%, #ffe3e9 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #fef9d7 0%, #f9d29d 100%)",
  "linear-gradient(135deg, #fffcf7 0%, #f3e7e9 100%)",
  "linear-gradient(135deg, #fffbd5 0%, #b20a2c 100%)",
  "linear-gradient(135deg, #ffefba 0%, #ffffff 100%)",
  "linear-gradient(135deg, #ffe8ec 0%, #f7d9e3 100%)",
  "linear-gradient(135deg, #fff7e5 0%, #ffd9a8 100%)",
  "linear-gradient(135deg, #ffe3e3 0%, #ffc9c9 100%)",
  "linear-gradient(135deg, #fff9e6 0%, #ffe7c4 100%)",
  "linear-gradient(135deg, #fef6ff 0%, #f7e8ff 100%)",
  "linear-gradient(135deg, #fff8f0 0%, #ffe4c4 100%)",
  "linear-gradient(135deg, #fdf6e3 0%, #fae1c2 100%)",
  "linear-gradient(135deg, #fff0f5 0%, #ffd6e8 100%)",
  "linear-gradient(135deg, #fffdf2 0%, #ffe9c7 100%)",
  "linear-gradient(135deg, #fff7fa 0%, #ffe3f2 100%)"
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
  "linear-gradient(135deg, #000000 0%, #434343 100%)",
  "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
  "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
  "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
  "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
  "linear-gradient(135deg, #16222a 0%, #3a6073 100%)",
  "linear-gradient(135deg, #000000 0%, #434343 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #2d0b5a 0%, #642b73 100%)",
  "linear-gradient(135deg, #000000 0%, #0f2027 100%)",
  "linear-gradient(135deg, #1c1c33 0%, #3c3c66 100%)",
  "linear-gradient(135deg, #0a0a0f 0%, #1a1a2f 100%)",
  "linear-gradient(135deg, #1b1b2f 0%, #3d3d5c 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #2b2b2b 100%)",
  "linear-gradient(135deg, #1a0f2f 0%, #3a1f5f 100%)",
  "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)",
  "linear-gradient(135deg, #1a1a55 0%, #0f0f33 100%)",
  "linear-gradient(135deg, #0f2f2f 0%, #1a4f4f 100%)",
  "linear-gradient(135deg, #050510 0%, #1a1a2f 100%)"
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

  // SHIFT + A toggles panel visibility
  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "a" && e.shiftKey) {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Admin unlock
  const unlock = () => {
    if (password === "Crown26") {
      setAuthenticated(true);
    }
  };

  // Dragging logic
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

  // Apply swatch (Day or Night) — drives CSS vars only
  const applySwatch = (mode, gradient) => {
    localStorage.setItem(`theme-${mode}`, gradient);

    if (mode === "day") {
      document.documentElement.style.setProperty("--active-day-gradient", gradient);
    } else {
      document.documentElement.style.setProperty("--active-night-gradient", gradient);
    }
  };

  // Load saved gradients on mount — no inline background
  useEffect(() => {
    const savedDay = localStorage.getItem("theme-day");
    const savedNight = localStorage.getItem("theme-night");

    if (savedDay) {
      document.documentElement.style.setProperty("--active-day-gradient", savedDay);
    }
    if (savedNight) {
      document.documentElement.style.setProperty("--active-night-gradient", savedNight);
    }

    // Ensure no inline background override
    document.body.style.background = "";
  }, []);

  // Panel hidden?
  if (!visible) return null;

  // Render
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

            {/* Day Swatches */}
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

            {/* Night Swatches */}
            <h3>Night Themes</h3>
            <div className="theme-swatches">
              {nightSwatches.map((g, i) => (
                <button
                  key={i}
                  onClick={() => applySwatch("night", g)}
                  style={{ background: g }}
                  className={`swatch-btn ${
                    localStorage.getItem("theme-night") === g ? "selected" : ""
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
