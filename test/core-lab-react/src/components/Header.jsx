// ============================================================
// Header.jsx — Cinematic Centered Crown + Nav (GR1)
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine.js";

export default function Header() {
  const { toggleSound } = useSoundEngine();

  // ------------------------------------------------------------
  // THEME TOGGLE — Corrected + Working
  // ------------------------------------------------------------
  function toggleTheme() {
    const current = document.body.dataset.theme || "day";
    const next = current === "day" ? "night" : "day";

    // Set theme
    document.body.dataset.theme = next;

    // Apply background from saved values
    const dayBg = localStorage.getItem("theme-day");
    const nightBg = localStorage.getItem("theme-night");

    if (next === "day" && dayBg) {
      document.body.style.background = dayBg;
    } else if (next === "night" && nightBg) {
      document.body.style.background = nightBg;
    }

    // Notify all components (HeroCrown, Gallery, Footer, etc.)
    window.dispatchEvent(
      new CustomEvent("theme-set", {
        detail: next,
      })
    );
  }

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

      {/* CENTER — Crown, Title, Tagline, Nav */}
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
