// ============================================================
// main.jsx — React Entry Point (with Sentinel Watchkeeper)
// ============================================================

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
import "./styles/background3d.css";

// SENTINEL WATCHKEEPER
import { SentinelPanel } from "./sentinel/SentinelPanel";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <SentinelPanel />   {/* ⭐ ONE BUTTON. ONE HANDSHAKE. FULL TELEMETRY. */}
  </React.StrictMode>
);
