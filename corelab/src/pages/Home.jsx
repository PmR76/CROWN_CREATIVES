// src/pages/Home.jsx (or LabHome.jsx)
import CharacterBg from "../components/CharacterBg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FrostedCards from "../components/FrostedCards";
import Ticker from "../components/Ticker";
import HeroCrown from "../components/HeroCrown";
import HeroGallery from "../components/HeroGallery";
import ThemePanel from "../components/ThemePanel";
import WatchkeeperHUD from "../components/WatchkeeperHUD";

export default function LabHome() {
  return (
    <div className="lab-home-root">
      {/* Background layer */}
      <div className="lab-home-background">
        <CharacterBg
          gridText="  Crown Creatives"
          font={{
            fontFamily: "Urbanist",
            fontWeight: 800,
            fontSize: 14,
            lineHeight: 1,
            letterSpacing: 0,
            textAlign: "left",
          }}
          colors={{
            paletteCount: 1,
            color1: "#CFC22A",
            color2: "#FFFFFF",
            color3: "#FFFFFF",
            color4: "#FFFFFF",
            color5: "#FFFFFF",
          }}
          reverse={false}
          backgroundColor="#000000"
        />
      </div>

      {/* HUD + Theme controls */}
      <WatchkeeperHUD />
      <ThemePanel />

      {/* Injectable modules (controlled by HUD/Theme state) */}
      <Header />
      <HeroCrown />
      <HeroGallery />
      <Ticker />
      <FrostedCards />
      <Footer />
    </div>
  );
}
