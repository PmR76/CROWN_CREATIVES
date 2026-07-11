// ============================================================
// Layout.jsx — Global Wrapper
// ============================================================

import React from "react";
import Header from "./Header";
import DiagnosticsPanel from "./DiagnosticsPanel";
import AdminGate from "../admin/AdminGate";

export default function Layout({ children }) {
  return (
    <div className="core-layout">
      <Header />

      {/* ⭐ AdminGate listens for Shift + A */}
      <AdminGate />

      {children}

      <DiagnosticsPanel />
    </div>
  );
}
