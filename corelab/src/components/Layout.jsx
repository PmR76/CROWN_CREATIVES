// ============================================================
// Layout.jsx — Core Lab OS Shell (GR1)
// ============================================================

import React from "react";

// Components
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Background3D from "./Background3D.jsx";

// Styles
import "../styles/gradients.css";
import "../styles/app.css";
import "../styles/background3d.css";

export default function Layout({ children }) {
  return (
    <div className="corelab-shell gradient-night">

      {/* ⭐ Cosmic Background Layer */}
      <div id="webgl-background" className="background3d-container">
        <Background3D />
      </div>

      {/* OS TOP BAR */}
      <div className="os-topbar">
        <div className="os-left">
          <span className="os-crown">👑</span>
          <span className="os-title">Crown Creatives OS</span>
        </div>
        <div className="os-right">
          <span className="os-status">Online</span>
        </div>
      </div>

      {/* MAIN WINDOW */}
      <main className="os-window">
        {children}
      </main>

      {/* OS DOCK */}
      <div className="os-dock">
        <a href="/">Home</a>
        <a href="/gallery">Gallery</a>
        <a href="/projects">Projects</a>
        <a href="/videos">Videos</a>
        <a href="/podcasts">Podcasts</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
