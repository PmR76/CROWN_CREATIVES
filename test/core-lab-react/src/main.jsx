// ============================================================
// main.jsx — React Entry Point (STRICT MODE REMOVED)
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

// ⭐ Crown Creatives Editor OS — Global Admin Provider
import { AdminProvider } from "./admin/AdminContext";

// ============================================================
// GLOBAL CSS — Loaded once
// ============================================================
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/frosted-cards.css";
import "./styles/ticker.css";
import "./styles/corepanel.css";
import "./styles/hero-crown.css";
import "./styles/hero-gallery.css";
import "./styles/theme-panel.css";
import "./styles/background3d.css";

// ============================================================
// MOUNT APP — STRICTMODE REMOVED
// ============================================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <AdminProvider>
    <App />
  </AdminProvider>
);
