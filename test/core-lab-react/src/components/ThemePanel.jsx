// ============================================================
// ThemePanel.jsx — Admin Console (Draggable + Visual Swatches)
// ============================================================

import React, { useEffect, useState, useRef } from "react";
import "../styles/theme-panel.css";
import { useThemeEngine } from "../hooks/useThemeEngine";

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
    if (password === "Crown26") setAuthenticated(true);
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

    document.body.style.setProperty(`--${mode}-bg`, gradient);

    const current = document.body.dataset.theme || "day";
    if (current === mode) {
      document.body.style.background = gradient;
    }

    setThemeDirect(mode);
  };

  if (!visible) return null;

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
