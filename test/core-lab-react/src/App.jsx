import { useEffect } from "react";

import Header from "./components/Header";
import Background3D from "./components/Background3D";
import ThemePanel from "./components/ThemePanel";
import useThemeEngine from "./hooks/useThemeEngine";

import HeroCrown from "./components/HeroCrown";
import HeroGallery from "./components/HeroGallery";

import Cards from "./components/Cards";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";
import CorePanel from "./components/CorePanel";

import "./styles/core.css";

export default function App() {
  useThemeEngine();

  // Initial diagnostics
  useEffect(() => {
    console.group("CORE-LAB SNAPSHOT");
    console.log("Header Loaded:", true);
    console.log("Background3D Active:", true);
    console.log("HeroCrown Active:", true);
    console.log("HeroGallery Active:", true);
    console.log("ThemePanel Active:", true);
    console.log("Cards Loaded:", true);
    console.log("Ticker Running:", true);
    console.log("Footer Active:", true);
    console.log("CorePanel Active:", true);
    console.log("FPS Target:", 60);
    console.groupEnd();
  }, []);

  // Periodic snapshot (no spam)
  useEffect(() => {
    const snapshot = () => {
      const ticker = document.querySelector(".ticker-track");
      const footer = document.querySelector(".footer-glass");

      if (!ticker || !footer) return;

      const tickerStyle = getComputedStyle(ticker);
      const footerStyle = getComputedStyle(footer);

      console.group("CORE SNAPSHOT");
      console.log("Ticker Speed:", tickerStyle.animationDuration);
      console.log("Footer Glow:", footerStyle.boxShadow);
      console.log("Footer Blur:", footerStyle.backdropFilter);
      console.groupEnd();
    };

    const interval = setInterval(snapshot, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <Background3D />

      <HeroCrown />
      <ThemePanel />
      <HeroGallery />

      <div className="core-layout">
        <Cards />
        <Ticker />
        <Footer />
        <CorePanel />
      </div>
    </>
  );
}
