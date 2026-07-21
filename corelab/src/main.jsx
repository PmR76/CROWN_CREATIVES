// ============================================================
// main.jsx — Core Lab Entry (Layer 3 Runtime)
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.jsx";

// Core Lab OS Providers
import { AdminProvider } from "./admin/AdminContext";

// Watchkeeper HUD (Layer 3 — Bottom Drawer)
import WatchkeeperHUD from "./components/WatchkeeperHUD/WatchkeeperHUD.jsx";

// Buildstamp (Layer 3 — Bottom Left)
import Buildstamp from "./components/Buildstamp.jsx";

// Global CSS (Layer 3)
import "./styles/core.css";
import "./styles/theme-panel.css";
import "./styles/background3d.css";
import "./styles/header.css";
import "./styles/footer.css";

// ============================================================
// MOUNT — SINGLE ROOT
// ============================================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AdminProvider>
      <App />
      <WatchkeeperHUD />
      <Buildstamp />
    </AdminProvider>
  </Router>
);
