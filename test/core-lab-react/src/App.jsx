// ============================================================
// App.jsx — Crown Creatives Core Lab React (FINAL CLEAN VERSION)
// ============================================================

import React from "react";
import useThemeEngine from "./hooks/useThemeEngine";

// COMPONENTS
import FaultScanner from "./FaultScanner";
import Header from "./components/Header";
import Background3D from "./components/Background3D";
import ThemePanel from "./components/ThemePanel";
import HeroCrown from "./components/HeroCrown";
import HeroGallery from "./components/HeroGallery";
import Cards from "./components/Cards";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";
import CorePanel from "./components/CorePanel";

// GLOBAL CORE CSS
import "./styles/core.css";

export default function App() {
  // Mount theme engine once
  const { theme } = useThemeEngine();

  return (
    <>
      {/* RUNTIME FAULT SCANNER */}
      <FaultScanner />

      {/* HEADER ALWAYS FIRST */}
      <Header />

      {/* 3D BACKGROUND */}
      <Background3D />

      {/* HERO CROWN */}
      <HeroCrown />

      {/* THEME PANEL */}
      <ThemePanel />

      {/* HERO GALLERY */}
      <HeroGallery />

      {/* MAIN CORE-LAB LAYOUT */}
      <div className="core-layout">
        <Cards />
        <Ticker />
        <Footer />
        <CorePanel />
      </div>
    </>
  );
}
