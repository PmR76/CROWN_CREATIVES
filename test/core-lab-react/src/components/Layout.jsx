// ============================================================
// Layout.jsx — Global Wrapper (Header + Diagnostics + Admin OS)
// ============================================================

import React from "react";
import Header from "./Header";
import DiagnosticsPanel from "./DiagnosticsPanel";

// ⭐ Admin OS
import AdminGate from "../admin/AdminGate";
import AdminPanel from "../admin/AdminPanel";
import { useAdmin } from "../admin/AdminContext";

// GLOBAL CINEMATIC CSS IMPORTS
import "../styles/header.css";
import "../styles/gradients.css";
import "../styles/hero-crown.css";
import "../styles/theme-panel.css";
import "../styles/diagnostics.css";

export default function Layout({ children }) {
  const { isAdmin } = useAdmin();   // ⭐ Now Layout listens to AdminContext

  return (
    <div className="core-layout">
      <Header />

      {/* ⭐ Admin Login (Password: Crown26) */}
      <AdminGate />

      {/* ⭐ Admin Panel (Editor OS) */}
      {isAdmin && <AdminPanel />}

      {/* Page content */}
      {children}

      <DiagnosticsPanel />
    </div>
  );
}
