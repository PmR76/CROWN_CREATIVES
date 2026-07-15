// ============================================================
// Home.jsx — Crown Creatives Homepage (GR1 Unified Layout)
// ============================================================

import HeroCrown from "../components/HeroCrown";
import HeroGallery from "../components/HeroGallery";
import FrostedCards from "../components/FrostedCards";
import Ticker from "../components/Ticker";

import "../styles/hero-crown.css";
import "../styles/hero-gallery.css";
import "../styles/frosted-cards.css";
import "../styles/ticker.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO GALLERY */}
      <HeroGallery />

      {/* FROSTED CARDS */}
      <FrostedCards />

      {/* TICKER */}
      <Ticker />

    </div>
  );
}
