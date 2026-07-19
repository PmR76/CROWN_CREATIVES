// ============================================================
// main.jsx — React Entry Point (GR1 Stable + Sentinel + Router)
// ============================================================

// GLOBAL ERROR VISIBILITY
window.addEventListener("error", (e) => {
  console.log("GLOBAL ERROR:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
  console.log("PROMISE ERROR:", e.reason);
});

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Crown Creatives Editor OS — Global Admin Provider
import { AdminProvider } from "./admin/AdminContext";

// React Router — THIS MUST BE THE ONLY ROUTER IN YOUR APP
import { BrowserRouter as Router } from "react-router-dom";

// ============================================================
// GLOBAL CSS — Loaded once
// ============================================================
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/corepanel.css";
import "./styles/theme-panel.css";
import "./styles/background3d.css";
import "./styles/core.css";

// ============================================================
// SENTINEL WATCHKEEPER PANEL
// ============================================================
import { SentinelPanel } from "./sentinel/SentinelPanel";

// ============================================================
// MOUNT APP — SINGLE ROOT (Correct)
// ============================================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AdminProvider>
      <App />
      <SentinelPanel />
    </AdminProvider>
  </Router>
);
