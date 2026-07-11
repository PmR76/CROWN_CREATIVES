// ============================================================
// Layout.jsx — Global Wrapper (Header + Diagnostics + Children)
// ============================================================

import React from "react";
import Header from "./Header";
import DiagnosticsPanel from "./DiagnosticsPanel";

// ⭐ Admin Login Gate (Shift + A → password)
import AdminGate from "../admin/AdminGate";

// GLOBAL CINEMATIC CSS IMPORTS
import "../styles/header.css";
import "../styles/gradients.css";
import "../styles/hero-crown.css";
import "../styles/theme-panel.css";
import "../styles/diagnostics.css";

export default function Layout({ children }) {
  return (
    <div className="core-layout">
      <Header />

      {/* ⭐ AdminGate listens for Shift + A */}
      <AdminGate />

      {/* Page content */}
      {children}

      <DiagnosticsPanel />
    </div>
  );
}
