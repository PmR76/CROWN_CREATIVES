// ============================================================
// Header.jsx — Crown Creatives Cinematic Header (FINAL FIXED)
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Header() {
  const { isMuted, toggleSound } = useSoundEngine();

  return (
    <header className="cc-header">
      {/* LEFT: SOUND TOGGLE */}
      <div className="cc-header-left">
        <button
          id="soundToggle"
          className="cc-toggle"
          onClick={toggleSound}
        >
          <img
            src="/assets/icons/music.png"
            alt="Sound Toggle"
          />
        </button>
      </div>

      {/* CENTER: HEADER CROWN + TITLE + TAGLINE + NAV */}
      <div className="cc-header-center">
        <img
          src="/assets/icons/head-crown.svg"
          alt="Crown Creatives Crown"
          className="cc-header-crown"
        />
        <h1 className="cc-header-title">Crown Creatives</h1>
        <p className="cc-header-tagline">
          Artistry • Resilience • Imagination
        </p>
        <nav className="cc-header-nav">
          <a href="/">HOME</a>
          <a href="/about/">ABOUT</a>
          <a href="/gallery/">GALLERY</a>
          <a href="/projects/">PROJECTS</a>
          <a href="/videos/">VIDEOS</a>
          <a href="/podcasts/">PODCASTS</a>
          <a href="/blog/">BLOG</a>
          <a href="/contact/">CONTACT</a>
        </nav>
      </div>

      {/* RIGHT: THEME TOGGLE */}
      <div className="cc-header-right">
        <button
          id="themeToggle"
          className="cc-toggle"
          onClick={() => {
            // useThemeEngine expects "day" / "dark"
            const current = document.body.dataset.theme || "day";
            const next = current === "dark" ? "day" : "dark";

            // Fire the React theme event that useThemeEngine listens to
            window.dispatchEvent(
              new CustomEvent("theme-set", { detail: next })
            );
          }}
        >
          <img
            src="/assets/icons/sun-moon.png"
            alt="Theme Toggle"
          />
        </button>
      </div>
    </header>
  );
}
