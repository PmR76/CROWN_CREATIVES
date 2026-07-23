// ============================================================
// Home.jsx — Crown Creatives Homepage (GR1 Stable, Overflow-Safe)
// ============================================================

import { useEffect, useState } from "react";

import Header from "../components/Header.jsx";
import HeroCrown from "../components/HeroCrown.jsx";
import HeroGallery from "../components/HeroGallery.jsx";
import FrostedCards from "../components/FrostedCards.jsx";
import Ticker from "../components/Ticker.jsx";
import Footer from "../components/Footer.jsx";

import { runMusicSentinel } from "../sentinel/MusicSentinel.js";

import "../styles/header.css";
import "../styles/hero-crown.css";
import "../styles/hero-gallery.css";
import "../styles/frosted-cards.css";
import "../styles/ticker.css";
import "../styles/footer.css";

export default function Home() {
  const [sentinelStatus, setSentinelStatus] = useState("BOOTING");

  useEffect(() => {
    async function boot() {
      try {
        const musicReport = await runMusicSentinel();
        setSentinelStatus(musicReport?.finalStatus || "WARN");
      } catch {
        setSentinelStatus("ERROR");
      }
    }
    boot();
  }, []);

  const badge =
    sentinelStatus === "OK"
      ? "🟢 Sentinel OK"
      : sentinelStatus === "WARN"
      ? "🟡 Sentinel Warnings"
      : sentinelStatus === "ERROR"
      ? "🔴 Sentinel Error"
      : "⚪ Booting Sentinel…";

  return (
    <main className="home-page">
      <Header />

      <div className="sentinel-status-badge">{badge}</div>

      <HeroCrown />

      <section className="home-section">
        <HeroGallery />
      </section>

      <section className="home-section">
        <FrostedCards />
      </section>

      <section className="home-section">
        <Ticker />
      </section>

      <Footer />
    </main>
  );
}
