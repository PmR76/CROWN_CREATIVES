// ============================================================
// HeroGallery.jsx — Static Cinematic Lanes (Engine Removed)
// ============================================================

import React from "react";

export default function HeroGallery() {
  return (
    <div className="hero-gallery-container">
      <div className="hero-gallery-lane hero-gallery-left">
        <img className="hero-gallery-img" />
      </div>

      <div className="hero-gallery-lane hero-gallery-right">
        <img className="hero-gallery-img" />
      </div>

      <div className="hero-gallery-glow-overlay">
        <div className="hero-gallery-glow-left"></div>
        <div className="hero-gallery-glow-right"></div>
      </div>
    </div>
  );
}
