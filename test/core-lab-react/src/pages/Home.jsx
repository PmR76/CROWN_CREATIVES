// ============================================================
// Home.jsx — Crown Creatives Homepage
// ============================================================

import React from "react";
import HeroCrown from "../components/HeroCrown";
import HeroGallery from "../components/HeroGallery";
import FrostedCards from "../components/FrostedCards";

export default function Home() {
  return (
    <div className="page-home">

      {/* ⭐ Cinematic Crown */}
      <HeroCrown />

      {/* ⭐ Hero Gallery (single instance) */}
      <HeroGallery />

      {/* ⭐ Frosted Cards under gallery */}
      <FrostedCards />

      {/* Legacy CC Sections (optional) */}
      <section className="cc-section">
        <h2>Artistry</h2>
        <p>Creativity expressed through craft, vision, and imagination.</p>
      </section>

      <section className="cc-section">
        <h2>Resilience</h2>
        <p>Strength and perseverance transform creativity into reality.</p>
      </section>

      <section className="cc-section">
        <h2>Imagination</h2>
        <p>The spark that turns ideas into reality and stories into worlds.</p>
      </section>

    </div>
  );
}
