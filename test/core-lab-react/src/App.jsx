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

  // Load theme engine once
  useThemeEngine();

  return (
    <>
      {/* HEADER ALWAYS FIRST */}
      <Header />

      {/* 3D BACKGROUND */}
      <Background3D />

      {/* HERO CROWN — sits under header */}
      <HeroCrown />

      {/* THEME PANEL — admin overlay */}
      <ThemePanel />

      {/* HERO GALLERY — sits under crown */}
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
