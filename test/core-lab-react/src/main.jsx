// ============================================================
// main.jsx — React Entry Point (GR1 Stable)
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

// ============================================================
// GLOBAL CSS — Loaded once (NO homepage CSS here)
// ============================================================
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/corepanel.css";
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
