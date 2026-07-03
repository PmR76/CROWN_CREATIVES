// ============================================================
// Header.jsx — Crown Creatives Cinematic Header (FULL MERGED)
// Restores head-crown.svg + theme toggle + sound toggle
// Corrects broken icon paths
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Header({ toggleTheme }) {
  const { isMuted, toggleSound } = useSoundEngine("default");

  return (
    <header className="cc-header">

      {/* LEFT: SOUND TOGGLE */}
      <div className="cc-header-left">
        <button
          id="soundToggle"
          className="cc-toggle"
          onClick={toggleSound}
          aria-pressed={!isMuted}
          aria-label="Toggle sound"
        >
          <img
            src="/assets/icons/music.png"
            alt="Sound Toggle"
            className="cc-header-icon"
          />
        </button>
      </div>

      {/* CENTER: CROWN + TITLE + TAGLINE + NAV */}
      <div className="cc-header-center">

        {/* HEADER CROWN (FIXED PATH) */}
        <img
          src="/assets/icons/head-crown.svg"
          alt="Crown Creatives Crown"
          className="cc-header-crown"
        />

        {/* TITLE */}
        <h1 className="cc-header-title">Crown Creatives</h1>

        {/* TAGLINE */}
        <p className="cc-header-tagline">
          Artistry • Resilience • Imagination
        </p>

        {/* NAVIGATION */}
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

      {/* RIGHT: THEME TOGGLE (FIXED PATH + WORKING) */}
      <div className="cc-header-right">
        <button
          id="themeToggle"
          className="cc-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <img
            src="/assets/icons/sun-moon.png"
            alt="Theme Toggle"
            className="cc-header-icon"
          />
        </button>
      </div>

    </header>
  );
}
