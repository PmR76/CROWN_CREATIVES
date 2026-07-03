// ============================================================
// Header.jsx — Crown Creatives Cinematic Header
// Sound toggle wired to SoundEngine
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Header() {
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
          <img src="/assets/icons/music.png" alt="Sound Toggle" />
        </button>
      </div>

      {/* CENTER: TITLE + TAGLINE */}
      <div className="cc-header-center">
        <h1 className="cc-header-title">Crown Creatives</h1>
        <p className="cc-header-tagline">
          Artistry • Resilience • Imagination
        </p>

        <nav className="cc-header-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#projects">Projects</a>
          <a href="#videos">Videos</a>
          <a href="#podcasts">Podcasts</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      {/* RIGHT: FUTURE TOGGLES / STATUS */}
      <div className="cc-header-right">
        {/* reserved for theme toggle / status */}
      </div>
    </header>
  );
}
