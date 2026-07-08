// ============================================================
// App.jsx — Crown Creatives Core Application (Final Merged Version)
// ============================================================

import React from "react";

// COMPONENTS
import Header from "./components/Header.jsx";
import Background3D from "./components/Background3D.jsx";
import HeroCrown from "./components/HeroCrown.jsx";
import ThemePanel from "./components/ThemePanel.jsx";
import HeroGallery from "./components/HeroGallery.jsx";
import Footer from "./components/Footer.jsx";
import SentinelPanel from "./components/SentinelPanel.jsx";

// IMPORTANT: use named import, not default
import { useThemeEngine } from "./hooks/useThemeEngine.js";

export default function App() {

  // Mount theme engine once
  useThemeEngine();

  return (
    <>
      {/* HEADER ALWAYS FIRST */}
      <Header />

      {/* 3D BACKGROUND */}
      <Background3D />

      {/* HERO CROWN */}
      <HeroCrown />

      {/* THEME PANEL (SHIFT + A) */}
      <ThemePanel />

      {/* HERO GALLERY */}
      <HeroGallery />

      {/* SENTINEL MANIFEST + ASSET SCANNER */}
      <div style={{ padding: "20px" }}>
        <SentinelPanel />
      </div>

      {/* FOOTER ALWAYS LAST */}
      <Footer />
    </>
  );
}
