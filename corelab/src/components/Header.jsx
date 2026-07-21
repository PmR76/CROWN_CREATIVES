// ============================================================
// Header.jsx — Cinematic Centered Crown + Nav (GR1 Restored)
// ============================================================

import React, { useEffect } from "react";
import "../styles/header.css";

// Hooks
import { useSoundEngine } from "../hooks/useSoundEngine.js";

// Theme Engine
import { initThemeEngine, toggleTheme } from "../theme/themeEngine.js";

export default function Header() {
  const { toggleSound } = useSoundEngine();

  useEffect(() => {
    initThemeEngine();
  }, []);

  return (
    <header className="hero-header">

      {/* LEFT — Sound */}
      <div className="hero-header-left">
        <button
          id="soundToggle"
          className="sound-toggle"
          onClick={toggleSound}
        >
          <img
            src="/assets/icons/music.png"
            alt="Sound Toggle"
            className="sound-toggle-icon"
          />
        </button>
      </div>

      {/* CENTER — Crown + Title + Tagline + Nav */}
      <div className="hero-header-center">

        <img
          src="/assets/icons/head-crown.svg"
          alt="Crown Creatives Crown"
          className="reduced-crown"
        />

        <h1 className="cc-header-title">Crown Creatives</h1>
        <p className="cc-header-tagline">
          Artistry • Resilience • Imagination
        </p>

        <nav className="cc-header-nav">
          <button>HOME</button>
          <button>ABOUT</button>
          <button>GALLERY</button>
          <button>PROJECTS</button>
          <button>VIDEOS</button>
          <button>PODCASTS</button>
          <button>BLOG</button>
          <button>CONTACT</button>
        </nav>
      </div>

      {/* RIGHT — Theme */}
      <div className="hero-header-right">
        <button
          id="themeToggle"
          className="theme-toggle"
          onClick={toggleTheme}
        >
          <img
            src="/assets/icons/sun-moon.png"
            alt="Theme Toggle"
            className="theme-toggle-icon"
          />
        </button>
      </div>

    </header>
  );
}
