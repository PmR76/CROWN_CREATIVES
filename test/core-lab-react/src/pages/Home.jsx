// ============================================================
// Home.jsx — Crown Creatives Homepage
// ============================================================

import React from "react";
import HeroCrown from "../components/HeroCrown";

export default function Home() {
  return (
    <div className="page-home">
      <HeroCrown />

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
