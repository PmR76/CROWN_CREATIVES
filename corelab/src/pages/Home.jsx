// ============================================================
// Home.jsx — Clean GR1 Homepage wired into CoreHome
// ============================================================

import CoreHome from "../components/CoreHome/CoreHome.jsx";

import HeroCrown from "../components/HeroCrown.jsx";
import HeroGallery from "../components/HeroGallery.jsx";
import FrostedCards from "../components/FrostedCards.jsx";
import Ticker from "../components/Ticker.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <CoreHome>
      {/* Hero Crown + Theme Toggle */}
      <HeroCrown />

      {/* Gallery */}
      <section className="home-block">
        <HeroGallery />
      </section>

      {/* Cards */}
      <section className="home-block">
        <FrostedCards />
      </section>

      {/* Ticker */}
      <section className="home-block">
        <Ticker />
      </section>

      {/* Footer */}
      <Footer />
    </CoreHome>
  );
}
