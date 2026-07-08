// ============================================================
// App.jsx — Crown Creatives Core Lab React (FINAL MERGED VERSION)
// ============================================================

import React from "react";
import useThemeEngine from "./hooks/useThemeEngine";
import { useDiagnostics } from "./hooks/useDiagnostics";

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
import SentinelPanel from "./components/SentinelPanel";

// GLOBAL CORE CSS
import "./styles/core.css";

export default function App() {
  // Mount theme engine once
  const { theme } = useThemeEngine();

  // Diagnostics (FPS, errors, component health)
  const diagnostics = useDiagnostics();

  // Expose theme for Sentinel / diagnostics
  window.__activeTheme = theme;

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

      {/* THEME PANEL (SHIFT + A) */}
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

      {/* SENTINEL MANIFEST + ASSET SCANNER */}
      <div style={{ padding: "20px" }}>
        <SentinelPanel />
      </div>

      {/* CORE DIAGNOSTICS */}
      <div className="core-diagnostics" style={{ padding: "20px" }}>
        <h2>Core Diagnostics</h2>

        <p><strong>Health:</strong> {diagnostics.health}</p>
        <p><strong>Cards:</strong> {diagnostics.cards}</p>
        <p><strong>Ticker:</strong> {diagnostics.ticker}</p>
        <p><strong>Footer:</strong> {diagnostics.footer}</p>
        <p><strong>FPS:</strong> {diagnostics.fps}</p>

        <div style={{ marginTop: "10px" }}>
          <strong>Errors:</strong>
          {diagnostics.errors.length === 0 ? (
            <p>None</p>
          ) : (
            <ul>
              {diagnostics.errors.map((err, i) => (
                <li key={i}>{String(err)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
