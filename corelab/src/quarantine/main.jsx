// ============================================================
// main.jsx — Core Lab Entry (Clean Single-Root Mount)
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

// Global Providers
import { AdminProvider } from "./admin/AdminContext.jsx";

// Global CSS
import "./styles/core.css";
import "./styles/background3d.css";
import "./styles/header.css";
import "./styles/footer.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element #root not found — React cannot mount.");
} else {
  ReactDOM.createRoot(rootElement).render(
    <AdminProvider>
      <App />
    </AdminProvider>
  );
}
