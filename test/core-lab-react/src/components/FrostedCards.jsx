// ============================================================
// FrostedCards.jsx — 3 Cinematic Frosted Glass Cards
// ============================================================

import React from "react";
import "../styles/frosted-cards.css";

export default function FrostedCards() {
  return (
    <section className="frosted-cards">

      <div className="frosted-card">
        <h3>Artistry</h3>
        <p>Creativity expressed through craft, vision, and imagination.</p>
      </div>

      <div className="frosted-card">
        <h3>Resilience</h3>
        <p>Strength and perseverance transform creativity into reality.</p>
      </div>

      <div className="frosted-card">
        <h3>Imagination</h3>
        <p>The spark that turns ideas into reality and stories into worlds.</p>
      </div>

    </section>
  );
}
