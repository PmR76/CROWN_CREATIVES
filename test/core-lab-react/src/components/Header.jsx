// ============================================================
// Header.jsx — Crown Creatives Cinematic Header (FINAL MERGED)
// Sound toggle + Theme toggle + Day/Night Crown Transition
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine";
import { themeEngine } from "../theme/ThemeEngine";

export default function Header() {
  // unified sound hook (no "default" argument)
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
          <img src="/assets/icons/music.png" alt="Sound Toggle" />
        </button>
      </div>

      {/* CENTER: CROWN + TITLE + TAGLINE + NAV */}
      <div className="cc-header-center">

        {/* DAY CROWN */}
        <img
          id="hero-crown-day"
          src="/assets/icons/day-crown.svg"
          alt="Day Crown"
          className="cc-header-crown visible"
        />

        {/* NIGHT CROWN */}
        <img
          id="hero-crown-night"
          src="/assets/icons/night-crown.svg"
          alt="Night Crown"
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

      {/* RIGHT: THEME TOGGLE */}
      <div className="cc-header-right">
        <button
          id="themeToggle"
          className="cc-toggle"
          onClick={() => themeEngine.toggle()}
        >
          <img src="/assets/icons/sun-moon.png" alt="Theme Toggle" />
        </button>
      </div>

    </header>
  );
}
