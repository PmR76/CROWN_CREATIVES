// ============================================================
// ThemePanel.jsx — Admin Console (Password Protected)
// ============================================================

import React, { useEffect, useState } from "react";

export default function ThemePanel() {
  const [visible, setVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // SHIFT + A opens panel
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

  // Theme selection
  const setTheme = (theme) => {
    document.body.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent("theme-set", { detail: theme }));
  };

  // Swatch selection
const applySwatch = (mode, gradient) => {
  // Save admin choice
  localStorage.setItem(`theme-${mode}`, gradient);

  // Apply immediately if current theme matches
  const current = document.body.dataset.theme || "day";
  if (current === mode) {
    document.body.style.background = gradient;
  }
};

  // Load saved theme on mount
  useEffect(() => {
    const day = localStorage.getItem("theme-day");
    const night = localStorage.getItem("theme-dark");

    const current = document.body.dataset.theme || "day";

    if (current === "day" && day) {
      document.body.style.background = day;
    }
    if (current === "dark" && night) {
      document.body.style.background = night;
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="theme-panel">
      <div className="theme-panel-inner">

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
                <button key={i} onClick={() => applySwatch("day", g)}>
                  Day {i + 1}
                </button>
              ))}
            </div>

            <h3>Night Themes</h3>
            <div className="theme-swatches">
              {nightSwatches.map((g, i) => (
                <button key={i} onClick={() => applySwatch("dark", g)}>
                  Night {i + 1}
                </button>
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
// Swatch Definitions — Add as many as you want
// ============================================================

const daySwatches = [
  "radial-gradient(circle at top, #ffffff 0%, #ffe9c9 40%, #ffd9a1 100%)",
  "radial-gradient(circle at top, #fdfdfd 0%, #e8f6ff 40%, #cdeaff 100%)",
  "radial-gradient(circle at top, #fff7e6 0%, #ffe0b3 40%, #ffc266 100%)",
  "radial-gradient(circle at top, #f8fff8 0%, #d6ffd6 40%, #b3ffb3 100%)",
];

const nightSwatches = [
  "radial-gradient(circle at top, #1a1a2f 0%, #050510 40%, #000000 100%)",
  "radial-gradient(circle at top, #2b1f55 0%, #120a33 40%, #050510 100%)",
  "radial-gradient(circle at top, #332b55 0%, #1a1333 40%, #050510 100%)",
  "radial-gradient(circle at top, #443366 0%, #221a44 40%, #0a0822 100%)",
];
