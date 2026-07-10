// ============================================================
// App.jsx — Crown Creatives (Merged Cinematic Header + Core Lab)
// ============================================================

import React from "react";

// --- Cinematic Header System (from theme-test) ---
import Header from "./components/Header.jsx";
import Background3D from "./components/Background3D.jsx";
import HeroCrown from "./components/HeroCrown.jsx";
import ThemePanel from "./components/ThemePanel.jsx";

// --- Core Lab React Content (existing project) ---
import HeroGallery from "./components/HeroGallery.jsx";
import Cards from "./components/Cards.jsx";
import Ticker from "./components/Ticker.jsx";
import Footer from "./components/Footer.jsx";
import CorePanel from "./components/CorePanel.jsx";

// --- Hooks (merged) ---
import { useThemeEngine } from "./hooks/useThemeEngine.js";
import { useSoundEngine } from "./hooks/useSoundEngine.js";

export default function App() {

  // Activate theme + sound engines once
  useThemeEngine();
  useSoundEngine();

  return (
    <>
      {/* Cinematic Header System */}
      <Header />
      <Background3D />

      {/* FIX: Gallery moved ABOVE the crown */}
      <HeroGallery />

      <HeroCrown />
      <ThemePanel />

      {/* Core Lab React Content */}
      <Cards />
      <Ticker />
      <CorePanel />
      <Footer />
    </>
  );
}
