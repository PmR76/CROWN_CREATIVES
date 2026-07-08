// ============================================================
// App.jsx — Crown Creatives Theme Test Lab (Clean Version)
// ============================================================

import React from "react";

import Header from "./components/Header.jsx";
import Background3D from "./components/Background3D.jsx";
import HeroCrown from "./components/HeroCrown.jsx";
import ThemePanel from "./components/ThemePanel.jsx";
import Footer from "./components/Footer.jsx";
import SentinelPanel from "./components/SentinelPanel.jsx";

import { useThemeEngine } from "./hooks/useThemeEngine.js";

export default function App() {

  // Mount theme engine once
  useThemeEngine();

  return (
    <>
      <Header />
      <Background3D />
      <HeroCrown />
      <ThemePanel />

      {/* Sentinel diagnostics */}
      <div style={{ padding: "20px" }}>
        <SentinelPanel />
      </div>

      <Footer />
    </>
  );
}
