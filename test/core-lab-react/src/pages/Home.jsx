// ============================================================
// Home.jsx — Crown Creatives Homepage (GR1 Unified Layout)
// ============================================================

import HeroGallery from "../components/HeroGallery";
import FrostedCards from "../components/FrostedCards";
import Ticker from "../components/Ticker";

import "../styles/hero-gallery.css";
import "../styles/frosted-cards.css";
import "../styles/ticker.css";

export default function Home() {
  return (
    <main className="home-page">

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
