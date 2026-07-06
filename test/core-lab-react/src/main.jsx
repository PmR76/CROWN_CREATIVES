window.addEventListener("error", (e) => {
  console.log("GLOBAL ERROR:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
  console.log("PROMISE ERROR:", e.reason);
});

// ============================================================
// main.jsx — React Entry Point (FINAL CLEAN VERSION)
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ------------------------------------------------------------
// GLOBAL CSS (load once, in correct order)
// ------------------------------------------------------------

// Core layout + components
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/cards.css";
import "./styles/ticker.css";
import "./styles/corepanel.css";

// Hero systems
import "./styles/hero-crown.css";
import "./styles/hero-gallery.css";

// Theme systems
import "./styles/theme-panel.css";
import "./styles/gradients.css";   // gradient variables
import "./shared/theme.css";       // theme engine variables

// ------------------------------------------------------------
// MOUNT APP
// ------------------------------------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
