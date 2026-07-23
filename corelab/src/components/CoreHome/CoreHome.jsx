// ============================================================
// CoreHome.jsx — Unified Layout Wrapper (GR1 Stable)
// ============================================================

import Background3D from "../Background3D.jsx";
import Header from "../Header.jsx";

export default function CoreHome({ children }) {
  return (
    <div className="core-home">
      
      {/* Cosmic background behind everything */}
      <div id="webgl-background" className="background3d-container">
        <Background3D />
      </div>

      {/* Global header */}
      <Header />

      {/* Page content */}
      <div className="core-home-content">
        {children}
      </div>
    </div>
  );
}
