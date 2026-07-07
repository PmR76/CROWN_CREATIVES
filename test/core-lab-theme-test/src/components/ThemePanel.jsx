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
// Swatch Definitions — Cinematic Gradient Library
// ============================================================

const daySwatches = [
  // Soft whites
  "radial-gradient(circle at top, #ffffff 0%, #f2f2f2 40%, #e6e6e6 100%)",
  "radial-gradient(circle at top, #fdfdfd 0%, #fafafa 40%, #f0f0f0 100%)",

  // Warm sunrise
  "radial-gradient(circle at top, #fff7e6 0%, #ffe0b3 40%, #ffc266 100%)",
  "radial-gradient(circle at top, #ffe9c9 0%, #ffd9a1 40%, #ffbf80 100%)",

  // Peach glow
  "radial-gradient(circle at top, #ffe5d9 0%, #ffc9b9 40%, #ffb3a1 100%)",
  "radial-gradient(circle at top, #fff0e6 0%, #ffd6cc 40%, #ffb3a6 100%)",

  // Sky blues
  "radial-gradient(circle at top, #e8f6ff 0%, #cdeaff 40%, #b3ddff 100%)",
  "radial-gradient(circle at top, #e6f7ff 0%, #cceeff 40%, #b3e6ff 100%)",

  // Mint fresh
  "radial-gradient(circle at top, #f8fff8 0%, #d6ffd6 40%, #b3ffb3 100%)",
  "radial-gradient(circle at top, #f0fff0 0%, #ccffcc 40%, #aaffaa 100%)",

  // Gold daylight
  "radial-gradient(circle at top, #fff4cc 0%, #ffe699 40%, #ffdb66 100%)",
  "radial-gradient(circle at top, #fff2bf 0%, #ffe08c 40%, #ffd066 100%)",

  // Pink daylight
  "radial-gradient(circle at top, #ffe6f2 0%, #ffcce6 40%, #ffb3d9 100%)",
  "radial-gradient(circle at top, #ffe0f0 0%, #ffb8e0 40%, #ff99d6 100%)",

  // Clean neutrals
  "radial-gradient(circle at top, #f7f7f7 0%, #eaeaea 40%, #dcdcdc 100%)",
  "radial-gradient(circle at top, #f5f5f5 0%, #e5e5e5 40%, #d5d5d5 100%)",

  // Soft lavender
  "radial-gradient(circle at top, #f3e8ff 0%, #e6ccff 40%, #d9b3ff 100%)",
  "radial-gradient(circle at top, #f0e6ff 0%, #e0ccff 40%, #d0b3ff 100%)",
];

const nightSwatches = [
  // Deep space
  "radial-gradient(circle at top, #1a1a2f 0%, #050510 40%, #000000 100%)",
  "radial-gradient(circle at top, #0f0f1f 0%, #050510 40%, #000000 100%)",

  // Purple nebula
  "radial-gradient(circle at top, #2b1f55 0%, #120a33 40%, #050510 100%)",
  "radial-gradient(circle at top, #332b55 0%, #1a1333 40%, #050510 100%)",

  // Blue nightfall
  "radial-gradient(circle at top, #1a2a55 0%, #0f1a33 40%, #050510 100%)",
  "radial-gradient(circle at top, #1a2555 0%, #0f1633 40%, #050510 100%)",

  // Midnight gold
  "radial-gradient(circle at top, #443366 0%, #221a44 40%, #0a0822 100%)",
  "radial-gradient(circle at top, #4a3b66 0%, #261e44 40%, #0a0822 100%)",

  // Dark crimson
  "radial-gradient(circle at top, #331a1a 0%, #1a0f0f 40%, #0a0505 100%)",
  "radial-gradient(circle at top, #3d1f1f 0%, #221212 40%, #0a0505 100%)",

  // Deep teal
  "radial-gradient(circle at top, #0f2f2f 0%, #0a1f1f 40%, #051010 100%)",
  "radial-gradient(circle at top, #133333 0%, #0d2222 40%, #051010 100%)",

  // Royal night
  "radial-gradient(circle at top, #1a1a55 0%, #0f0f33 40%, #050510 100%)",
  "radial-gradient(circle at top, #202066 0%, #141444 40%, #050510 100%)",

  // Black violet
  "radial-gradient(circle at top, #1a0f2f 0%, #0f0a22 40%, #050510 100%)",
  "radial-gradient(circle at top, #221233 0%, #140a22 40%, #050510 100%)",
];
