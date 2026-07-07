// ============================================================
// Header.jsx — Final Sound + Theme Toggle (Working)
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine.js";

export default function Header() {
  const { toggleSound } = useSoundEngine();

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
            src="/assets/icons/sound-magic.svg"
            alt="Sound Toggle"
            className="sound-toggle-icon"
          />
        </button>
      </div>

      {/* CENTER */}
      <div className="hero-header-center">

        <img
          src="/assets/icons/head-crown.svg"
          alt="Crown Creatives Crown"
          className="reduced-crown"
        />

        <div className="hero-crown">
          <img src="/assets/icons/day-crown.svg" className="crown crown-day" />
          <img src="/assets/icons/night-crown.svg" className="crown crown-night" />
        </div>

        <h1 className="cc-header-title">Crown Creatives</h1>
        <p className="cc-header-tagline">Artistry • Resilience • Imagination</p>

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
