// ============================================================
// Layout.jsx — Global Wrapper (Header + Diagnostics + Children)
// ============================================================

import React from "react";
import Header from "./Header";
import DiagnosticsPanel from "./DiagnosticsPanel";

export default function Layout({ children }) {
  return (
    <div className="core-layout">
      <Header />
      {children}
      <DiagnosticsPanel />
    </div>
  );
}
