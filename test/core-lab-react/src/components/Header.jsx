// ============================================================
// Header.jsx — Final Sound + Theme Toggle + Crown Fade
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine.js";

export default function Header() {
  const { toggleSound } = useSoundEngine();

  // ⭐ NEW — Correct theme toggle logic
  function toggleTheme() {
    const current = document.body.dataset.theme || "day";
    const next = current === "day" ? "night" : "day";

    // Update dataset theme
    document.body.dataset.theme = next;

    // Dispatch theme-set event (AdminPanel + Layout.jsx listen for this)
    window.dispatchEvent(
      new CustomEvent("theme-set", { detail: next })
    );

    // Apply correct background immediately
    const day = localStorage.getItem("theme-day");
    const night = localStorage.getItem("theme-night");

    document.body.style.background = next === "day" ? day : night;
  }

  return (
    <header className="hero-header">
      {/* SOUND TOGGLE */}
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

      {/* CENTER */}
      <div className="hero-header-center">
        {/* ✔ Correct crown */}
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

      {/* THEME TOGGLE */}
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
