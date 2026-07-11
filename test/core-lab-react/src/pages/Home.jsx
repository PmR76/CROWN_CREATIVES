// ============================================================
// Home.jsx — Crown Creatives Homepage (Editor OS State Hub)
// ============================================================

import React, { useState, useEffect } from "react";

import HeroCrown from "../components/HeroCrown";
import HeroGallery from "../components/HeroGallery";
import FrostedCards from "../components/FrostedCards";
import Ticker from "../components/Ticker";

import { useAdmin } from "../admin/AdminContext";
import AdminPanel from "../admin/AdminPanel";

// ⭐ 60 Gradient Swatches (Day + Night)
import gradients from "../theme/theme-rotation";

export default function Home() {
  const { isAdmin } = useAdmin();

  // ============================================================
  // STATE: Frosted Cards (3 editable ad panels)
  // ============================================================
  const [cardsConfig, setCardsConfig] = useState([
    "Creativity expressed through craft, vision, and imagination.",
    "Strength and perseverance transform creativity into reality.",
    "The spark that turns ideas into reality and stories into worlds."
  ]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cardsConfig"));
    if (saved) setCardsConfig(saved);
  }, []);

  // ============================================================
  // STATE: Ticker Text
  // ============================================================
  const [tickerText, setTickerText] = useState(
    "CREATIVITY IS COURAGE • IMAGINATION IS POWER • ART IS FREEDOM • "
  );

  useEffect(() => {
    const saved = localStorage.getItem("tickerText");
    if (saved) setTickerText(saved);
  }, []);

  // ============================================================
  // STATE: Theme Selection (Day/Night gradients)
  // ============================================================
  const [currentTheme, setCurrentTheme] = useState("day-1");

  useEffect(() => {
    const saved = localStorage.getItem("currentTheme");
    if (saved) setCurrentTheme(saved);
  }, []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="page-home">

      {/* ⭐ Admin Panel (Editor OS) */}
      {isAdmin && (
        <AdminPanel
          cardsConfig={cardsConfig}
          setCardsConfig={setCardsConfig}
          tickerText={tickerText}
          setTickerText={setTickerText}
          gradients={gradients}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />
      )}

      {/* ⭐ Cinematic Crown */}
      <HeroCrown />

      {/* ⭐ Hero Gallery */}
      <HeroGallery />

      {/* ⭐ Frosted Cards (now editable + draggable) */}
      <FrostedCards cardsConfig={cardsConfig} />

      {/* ⭐ Ticker (now editable + draggable) */}
      <Ticker tickerText={tickerText} />

      {/* Legacy CC Sections */}
      <section className="cc-section">
        <h2>Artistry</h2>
        <p>{cardsConfig[0]}</p>
      </section>

      <section className="cc-section">
        <h2>Resilience</h2>
        <p>{cardsConfig[1]}</p>
      </section>

      <section className="cc-section">
        <h2>Imagination</h2>
        <p>{cardsConfig[2]}</p>
      </section>

    </div>
  );
}
