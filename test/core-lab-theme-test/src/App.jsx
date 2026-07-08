// ============================================================
// App.jsx — Crown Creatives Theme Test Lab (Minimal + Correct)
// ============================================================

import React from "react";

import Header from "./components/Header.jsx";
import Background3D from "./components/Background3D.jsx";
import HeroCrown from "./components/HeroCrown.jsx";
import ThemePanel from "./components/ThemePanel.jsx";

// IMPORTANT: named import
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
    </>
  );
}
