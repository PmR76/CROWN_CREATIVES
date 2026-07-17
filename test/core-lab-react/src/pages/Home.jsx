import { useEffect, useState } from "react";

import Background3D from "../components/Background3D";
import Header from "../components/Header";
import HeroCrown from "../components/HeroCrown";
import HeroGallery from "../components/HeroGallery";
import FrostedCards from "../components/FrostedCards";
import Ticker from "../components/Ticker";
import Footer from "../components/Footer";

import { runGallerySentinel } from "../sentinel/GallerySentinel";
import { runMusicSentinel } from "../sentinel/MusicSentinel";

import "../styles/background3d.css";
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
        const galleryReport = await runGallerySentinel();
        const musicReport = await runMusicSentinel();

        if (
          galleryReport.finalStatus === "OK" &&
          musicReport.finalStatus === "OK"
        ) {
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

    <main className="home-page">

      <Background3D />

      <Header />

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
  ;
}
