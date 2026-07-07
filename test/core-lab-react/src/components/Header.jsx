// ============================================================
// Header.jsx — Crown Creatives Cinematic Header (FINAL ALIGNED)
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
          <img src="/assets/icons/music.png" alt="Sound Toggle" />
        </button>
      </div>

      {/* CENTER */}
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

        {/* React-era nav: no hard page jumps */}
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

      {/* RIGHT: THEME TOGGLE */}
      <div className="cc-header-right">
        <button
          id="themeToggle"
          className="cc-toggle"
          onClick={() => {
            const current = document.body.dataset.theme || "day";
            const next = current === "night" ? "day" : "night";

            // Update body dataset directly
            document.body.dataset.theme = next;

            // Notify theme engine / diagnostics
            window.dispatchEvent(
              new CustomEvent("theme-set", { detail: next })
            );
          }}
        >
          <img src="/assets/icons/sun-moon.png" alt="Theme Toggle" />
        </button>
      </div>
    </header>
  );
}
