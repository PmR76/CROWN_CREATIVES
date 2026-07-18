import { useEffect, useState } from "react";

import Background3D from "../components/Background3D";
import Header from "../components/Header";
import HeroCrown from "../components/HeroCrown";
import HeroGallery from "../components/HeroGallery";
import FrostedCards from "../components/FrostedCards";
import Ticker from "../components/Ticker";
import Footer from "../components/Footer";

// ⭐ Sentinel UI
import SentinelPanel from "../components/SentinelPanel";

import { runMusicSentinel } from "../sentinel/MusicSentinel";

import "../styles/background3d.css";
import "../styles/header.css";
import "../styles/hero-crown.css";
import "../styles/hero-gallery.css";
import "../styles/frosted-cards.css";
import "../styles/ticker.css";
import "../styles/footer.css";
import "../styles/sentinel-panel.css";

export default function Home() {
  const [sentinelStatus, setSentinelStatus] = useState("BOOTING");

  useEffect(() => {
    async function boot() {
      try {
        const musicReport = await runMusicSentinel();

        if (musicReport.finalStatus === "OK") {
          setSentinelStatus("OK");
        } else {
          setSentinelStatus("WARN");
        }
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

      <Background3D />

      <Header />

      <div className="sentinel-status-badge">
        {badge}
      </div>

      {/* ⭐ Sentinel Watchkeeper UI */}
      <SentinelPanel />

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

      {/* ⭐ Floating, draggable, resizable production preview */}
      <div
        id="prod-preview"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "400px",
          height: "300px",
          border: "2px solid #444",
          background: "#fff",
          zIndex: 9999,
          boxShadow: "0 0 12px rgba(0,0,0,0.5)",
          resize: "both",
          overflow: "hidden",
          cursor: "move"
        }}
        draggable="true"
        onDragStart={(e) => {
          const el = e.currentTarget;
          e.dataTransfer.setData("text/plain", "");
          const rect = el.getBoundingClientRect();
          el.dataset.offsetX = e.clientX - rect.left;
          el.dataset.offsetY = e.clientY - rect.top;
        }}
        onDragEnd={(e) => {
          const el = e.currentTarget;
          const offsetX = parseInt(el.dataset.offsetX, 10);
          const offsetY = parseInt(el.dataset.offsetY, 10);
          el.style.left = `${e.clientX - offsetX}px`;
          el.style.top = `${e.clientY - offsetY}px`;
          el.style.bottom = "auto";
          el.style.right = "auto";
          el.style.position = "absolute";
        }}
      >
        <div style={{ background: "#222", color: "#fff", padding: "4px", fontSize: "14px" }}>
          Production Preview (crowncreatives.uk)
        </div>
        <iframe
          src="https://crowncreatives.uk"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Production Preview"
        />
      </div>

    </main>
  );
}
