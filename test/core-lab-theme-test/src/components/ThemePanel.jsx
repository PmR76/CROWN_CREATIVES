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
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // Peach Dawn
  "linear-gradient(135deg, #ffe29f 0%, #ffa99f 48%, #ff719a 100%)", // Candy Sunrise
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", // Golden Bloom
  "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", // Soft Cloudlight
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)", // Rose Mist
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", // Fairy Blossom
  "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)", // Blush Horizon
  "linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)", // Meadow Whisper
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)", // Sandlight
  "linear-gradient(135deg, #f6f0c4 0%, #f4d7a7 100%)", // Honey Glow
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)", // Lemon Sky
  "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)", // Frosted Daybreak
  "linear-gradient(135deg, #fffcdf 0%, #ffefc1 100%)", // Soft Gold Aura
  "linear-gradient(135deg, #ffe6fa 0%, #fcd1ff 100%)", // Lavender Cotton
  "linear-gradient(135deg, #fff5f7 0%, #ffe3e9 100%)", // Cherry Petal
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", // Dreamwave
  "linear-gradient(135deg, #fef9d7 0%, #f9d29d 100%)", // Sun Honey
  "linear-gradient(135deg, #fffcf7 0%, #f3e7e9 100%)", // Angelic Mist
  "linear-gradient(135deg, #fffbd5 0%, #b20a2c 100%)", // Solar Bloom
  "linear-gradient(135deg, #ffefba 0%, #ffffff 100%)", // Warm Breeze
  "linear-gradient(135deg, #ffe8ec 0%, #f7d9e3 100%)", // Pink Aura
  "linear-gradient(135deg, #fff7e5 0%, #ffd9a8 100%)", // Apricot Light
  "linear-gradient(135deg, #ffe3e3 0%, #ffc9c9 100%)", // Soft Rose
  "linear-gradient(135deg, #fff9e6 0%, #ffe7c4 100%)", // Golden Milk
  "linear-gradient(135deg, #fef6ff 0%, #f7e8ff 100%)", // Lilac Whisper
  "linear-gradient(135deg, #fff8f0 0%, #ffe4c4 100%)", // Peach Silk
  "linear-gradient(135deg, #fdf6e3 0%, #fae1c2 100%)", // Sandstone Glow
  "linear-gradient(135deg, #fff0f5 0%, #ffd6e8 100%)", // Blossom Veil
  "linear-gradient(135deg, #fffdf2 0%, #ffe9c7 100%)", // Sunlit Cream
  "linear-gradient(135deg, #fff7fa 0%, #ffe3f2 100%)"  // Pink Stardust
];

const nightSwatches = [
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", // Midnight Royal
  "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Deep Sapphire
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)", // Lunar Steel
  "linear-gradient(135deg, #000428 0%, #004e92 100%)", // Ocean Nightfall
  "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)", // Cold Nebula
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", // Arctic Night
  "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)", // Cosmic Ember
  "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)", // Aurora Flame
  "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)", // Twilight Indigo
  "linear-gradient(135deg, #232526 0%, #414345 100%)", // Shadow Mist
  "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)", // Moonlit Amethyst
  "linear-gradient(135deg, #16222a 0%, #3a6073 100%)", // Deep Glacier
  "linear-gradient(135deg, #000000 0%, #434343 100%)", // Black Starfield
  "linear-gradient(135deg, #1c1c1c 0%, #3a3a3a 100%)", // Iron Night
  "linear-gradient(135deg, #2e1f27 0%, #4b2e39 100%)", // Velvet Eclipse
  "linear-gradient(135deg, #1b2735 0%, #3a3f47 100%)", // Nebula Smoke
  "linear-gradient(135deg, #0f0f0f 0%, #2d2d2d 100%)", // Dark Matter
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", // Royal Void
  "linear-gradient(135deg, #2d0b5a 0%, #642b73 100%)", // Purple Galaxy
  "linear-gradient(135deg, #000000 0%, #0f2027 100%)", // Abyssal Blue
  "linear-gradient(135deg, #1c1c33 0%, #3c3c66 100%)", // Indigo Depth
  "linear-gradient(135deg, #0a0a0f 0%, #1a1a2f 100%)", // Nightfall Core
  "linear-gradient(135deg, #1b1b2f 0%, #3d3d5c 100%)", // Lunar Ice
  "linear-gradient(135deg, #0d0d0d 0%, #2b2b2b 100%)", // Obsidian
  "linear-gradient(135deg, #1a0f2f 0%, #3a1f5f 100%)", // Void Orchid
  "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)", // Deep Cosmos
  "linear-gradient(135deg, #1a1a55 0%, #0f0f33 100%)", // Royal Nightfall
  "linear-gradient(135deg, #0f2f2f 0%, #1a4f4f 100%)", // Teal Nebula
  "linear-gradient(135deg, #050510 0%, #1a1a2f 100%)"  // Midnight Ether
];
