// ============================================================
// Header.jsx — Final Sound + Theme Toggle + Crown Fade + Active Nav
// ============================================================

import React from "react";
import "../styles/header.css";
import { useSoundEngine } from "../hooks/useSoundEngine.js";
import { NavLink } from "react-router-dom";

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
            src="/assets/icons/music.png"
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

        {/* NAVIGATION — NOW USING NavLink WITH ACTIVE GLOW */}
        <nav className="cc-header-nav">

          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            HOME
          </NavLink>

          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            ABOUT
          </NavLink>

          <NavLink 
            to="/gallery" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            GALLERY
          </NavLink>

          <NavLink 
            to="/projects" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            PROJECTS
          </NavLink>

          <NavLink 
            to="/videos" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            VIDEOS
          </NavLink>

          <NavLink 
            to="/podcasts" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            PODCASTS
          </NavLink>

          <NavLink 
            to="/blog" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            BLOG
          </NavLink>

          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            CONTACT
          </NavLink>

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
            src="/assets/icons/sun-moon.png"
            alt="Theme Toggle"
            className="theme-toggle-icon"
          />
        </button>
      </div>

    </header>
  );
}
