// ============================================================
// Home.jsx — Crown Creatives Homepage (GR1 Unified Layout)
// Sentinel‑Integrated Homepage + Cosmic Nebula 2.0
// ============================================================

import { useEffect, useState } from "react";

import Background3D from "../components/background3D";
import HeroGallery from "../components/HeroGallery";
import FrostedCards from "../components/FrostedCards";
import Ticker from "../components/Ticker";

// Sentinel v2.0
import { runGallerySentinel } from "../sentinel/GallerySentinel";
import { runMusicSentinel } from "../sentinel/MusicSentinel";

import "../styles/background3d.css";
import "../styles/hero-gallery.css";
import "../styles/frosted-cards.css";
import "../styles/ticker.css";

export default function Home() {
  const [sentinelStatus, setSentinelStatus] = useState("BOOTING");

  // ------------------------------------------------------------
  // SENTINEL BOOT SEQUENCE (Homepage-Level Diagnostics)
  // ------------------------------------------------------------
  useEffect(() => {
    async function boot() {
      try {
        const galleryReport = await runGallerySentinel();
        const musicReport = await runMusicSentinel();

        console.group("🔵 Sentinel Homepage Diagnostics");
        console.log("Gallery Sentinel:", galleryReport);
        console.log("Music Sentinel:", musicReport);
        console.groupEnd();

        if (
          galleryReport.finalStatus === "OK" &&
          musicReport.finalStatus === "OK"
        ) {
          setSentinelStatus("OK");
        } else {
          setSentinelStatus("WARN");
        }
      } catch (err) {
        console.error("Sentinel boot error:", err);
        setSentinelStatus("ERROR");
      }
    }

    boot();
  }, []);

  // ------------------------------------------------------------
  // SENTINEL STATUS BADGE (Non-blocking UI Indicator)
  // ------------------------------------------------------------
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

      {/* Cosmic Nebula 2.0 Background */}
      <Background3D />

      {/* Sentinel Status Badge */}
      <div className="sentinel-status-badge">
        {badge}
      </div>

      <section className="home-section">
        <HeroGallery />
      </section>

      <section className="home-section">
        <FrostedCards />
      </section>

      <section className="home-section">
        <Ticker />
      </section>

    </main>
  );
}
