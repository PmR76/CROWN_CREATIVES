// ============================================================
// main.jsx — React Entry Point
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/hero-crown.css";
import "./styles/hero-gallery.css";
import "./styles/footer.css";


import "./styles/gradients.css";
import "./shared/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
