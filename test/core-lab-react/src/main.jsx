// ============================================================
// main.jsx — React Entry Point (STRICT MODE REMOVED)
// ============================================================

window.addEventListener("error", (e) => {
  console.log("GLOBAL ERROR:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
  console.log("PROMISE ERROR:", e.reason);
});

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// GLOBAL CSS
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/cards.css";
import "./styles/ticker.css";
import "./styles/corepanel.css";
import "./styles/hero-crown.css";
import "./styles/hero-gallery.css";
import "./styles/theme-panel.css";
import "./styles/gradients.css";
import "./shared/theme.css";

// MOUNT APP — STRICTMODE REMOVED
ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
