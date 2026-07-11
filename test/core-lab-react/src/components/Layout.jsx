// ============================================================
// Layout.jsx — Global Wrapper (Header + Diagnostics + Children)
// ============================================================

import React from "react";
import Header from "./Header";
import DiagnosticsPanel from "./DiagnosticsPanel";

// ⭐ GLOBAL CINEMATIC CSS IMPORTS
import "../styles/header.css";
import "../styles/gradients.css";
import "../styles/hero-crown.css";
import "../styles/theme-panel.css";
import "../styles/diagnostics.css";

export default function Layout({ children }) {
  return (
    <div className="core-layout">
      <Header />
      {children}
      <DiagnosticsPanel />
    </div>
  );
}
