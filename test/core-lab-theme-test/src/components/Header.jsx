// ============================================================
// Header.jsx — Crown Creatives Cinematic Header (Theme-Test Edition)
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Header() {
  const { isMuted, toggleSound } = useSoundEngine();

  return (
    <header className="hero-header">

      {/* ============================================================
         LEFT — SOUND TOGGLE (Neon, enlarged, no panel)
      ============================================================ */}
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

      {/* ============================================================
         CENTER — Crown + Title + Tagline + Navigation
      ============================================================ */}
      <div className="hero-header-center">

        {/* Crown with magical glow */}
        <img
          src="/assets/icons/head-crown.svg"
          alt="Crown Creatives Crown"
          className="cc-header-crown magical-crown-glow"
        />

        <h1 className="cc-header-title">Crown Creatives</h1>

        <p className="cc-header-tagline">
          Artistry • Resilience • Imagination
        </p>

        {/* Navigation */}
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

      {/* ============================================================
         RIGHT — THEME TOGGLE (Neon, enlarged, no panel)
      ============================================================ */}
      <div className="hero-header-right">
        <button
          id="themeToggle"
          className="theme-toggle"
          onClick={() => {
            const current = document.body.dataset.theme || "day";
            const next = current === "night" ? "day" : "night";
            document.body.dataset.theme = next;

            window.dispatchEvent(
              new CustomEvent("theme-set", { detail: next })
            );
          }}
        >
          <img
            src="/assets/icons/sun-moon2.png"
            alt="Theme Toggle"
            className="theme-toggle-icon"
          />
        </button>
      </div>

    </header>
  );
}
