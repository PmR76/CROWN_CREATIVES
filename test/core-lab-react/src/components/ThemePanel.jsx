// ============================================================
// ThemePanel.jsx — Admin Console (Draggable + Visual Swatches)
// ============================================================

import React, { useEffect, useState, useRef } from "react";
import "../styles/theme-panel.css";
import { useThemeEngine } from "../hooks/useThemeEngine.js";

const daySwatches = [
  "linear-gradient(135deg, #ffecd2, #fcb69f)",
  "linear-gradient(135deg, #ffe29f, #ffa99f, #ff719a)",
  "linear-gradient(135deg, #f6d365, #fda085)",
  "linear-gradient(135deg, #fdfbfb, #ebedee)",
  "linear-gradient(135deg, #ff9a9e, #fecfef)",
  "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
  "linear-gradient(135deg, #ffdde1, #ee9ca7)",
  "linear-gradient(135deg, #c1dfc4, #deecdd)",
  "linear-gradient(135deg, #fdfcfb, #e2d1c3)",
  "linear-gradient(135deg, #f6f0c4, #f4d7a7)",
  "linear-gradient(135deg, #fddb92, #d1fdff)",
  "linear-gradient(135deg, #fff1eb, #ace0f9)",
  "linear-gradient(135deg, #fffcdf, #ffefc1)",
  "linear-gradient(135deg, #ffe6fa, #fcd1ff)",
  "linear-gradient(135deg, #fff5f7, #ffe3e9)",
  "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  "linear-gradient(135deg, #fef9d7, #f9d29d)",
  "linear-gradient(135deg, #fffcf7, #f3e7e9)",
  "linear-gradient(135deg, #fffbd5, #b20a2c)",
  "linear-gradient(135deg, #ffefba, #ffffff)",
  "linear-gradient(135deg, #ffe8ec, #f7d9e3)",
  "linear-gradient(135deg, #fff7e5, #ffd9a8)",
  "linear-gradient(135deg, #ffe3e3, #ffc9c9)",
  "linear-gradient(135deg, #fff9e6, #ffe7c4)",
  "linear-gradient(135deg, #fef6ff, #f7e8ff)",
  "linear-gradient(135deg, #fff8f0, #ffe4c4)",
  "linear-gradient(135deg, #fdf6e3, #fae1c2)",
  "linear-gradient(135deg, #fff0f5, #ffd6e8)",
  "linear-gradient(135deg, #fffdf2, #ffe9c7)",
  "linear-gradient(135deg, #fff7fa, #ffe3f2)"
];

const nightSwatches = [
  "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  "linear-gradient(135deg, #1e3c72, #2a5298)",
  "linear-gradient(135deg, #141e30, #243b55)",
  "linear-gradient(135deg, #000428, #004e92)",
  "linear-gradient(135deg, #2c3e50, #4ca1af)",
  "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(135deg, #232526, #414345)",
  "linear-gradient(135deg, #1f1c2c, #928dab)",
  "linear-gradient(135deg, #16222a, #3a6073)",
  "linear-gradient(135deg, #000000, #434343)",
  "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
  "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
  "linear-gradient(135deg, #2b5876, #4e4376)",
  "linear-gradient(135deg, #232526, #414345)",
  "linear-gradient(135deg, #1f1c2c, #928dab)",
  "linear-gradient(135deg, #16222a, #3a6073)",
  "linear-gradient(135deg, #000000, #434343)",
  "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
  "linear-gradient(135deg, #2d0b5a, #642b73)",
  "linear-gradient(135deg, #000000, #0f2027)",
  "linear-gradient(135deg, #1c1c33, #3c3c66)",
  "linear-gradient(135deg, #0a0a0f, #1a1a2f)",
  "linear-gradient(135deg, #1b1b2f, #3d3d5c)",
  "linear-gradient(135deg, #0d0d0d, #2b2b2b)",
  "linear-gradient(135deg, #1a0f2f, #3a1f5f)",
  "linear-gradient(135deg, #0a0a1a, #1a1a3a)",
  "linear-gradient(135deg, #1a1a55, #0f0f33)",
  "linear-gradient(135deg, #0f2f2f, #1a4f4f)",
  "linear-gradient(135deg, #050510, #1a1a2f)"
];

export default function ThemePanel() {
  const [visible, setVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const panelRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const { setThemeDirect } = useThemeEngine();

  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "a" && e.shiftKey) {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const unlock = () => {
    if (password === "Crown26") {
      setAuthenticated(true);
    }
  };

  const startDrag = (e) => {
    const panel = panelRef.current;
    dragOffset.current = {
      x: e.clientX - panel.offsetLeft,
      y: e.clientY - panel.offsetTop
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

  const applySwatch = (mode, gradient) => {
    localStorage.setItem(`theme-${mode}`, gradient);

    if (mode === "day") {
      document.documentElement.style.setProperty("--active-day-gradient", gradient);
    } else {
      document.documentElement.style.setProperty("--active-night-gradient", gradient);
    }

    // ensure inline background is not locking things
    document.body.style.background = "";

    // keep theme role in sync
    setThemeDirect(mode);
  };

  useEffect(() => {
    const savedDay = localStorage.getItem("theme-day");
    const savedNight = localStorage.getItem("theme-night");

    if (savedDay) {
      document.documentElement.style.setProperty("--active-day-gradient", savedDay);
    }
    if (savedNight) {
      document.documentElement.style.setProperty("--active-night-gradient", savedNight);
    }

    document.body.style.background = "";
  }, []);

  if (!visible) return null;

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
