// ============================================================
// Background3D.jsx — Cosmic Nebula 2.0 (GR1 Cinematic Backdrop)
// ============================================================

import { useEffect } from "react";
import "../styles/background-3d.css";

export default function Background3D() {
  useEffect(() => {
    // Nothing needed here yet — CSS handles animation
  }, []);

  return (
    <div className="cosmic-3d-container">
      <div className="cosmic-stars"></div>
      <div className="cosmic-nebula"></div>
      <div className="cosmic-fog-layer"></div>
    </div>
  );
}
