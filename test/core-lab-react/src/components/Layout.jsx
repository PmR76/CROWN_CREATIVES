// ============================================================
// Layout.jsx — GR1 Unified Cinematic Zone (Corrected)
// ============================================================

import Header from "./Header";
import Footer from "./Footer";
import ThemePanel from "./ThemePanel";
import CorePanel from "./CorePanel";
import Background3D from "./Background3D";
import HeroCrown from "./HeroCrown";

import { useThemeEngine } from "../hooks/useThemeEngine";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Layout({ children }) {

  // ------------------------------------------------------------
  // HOOKS — MUST remain top-level and in fixed order
  // ------------------------------------------------------------
  useThemeEngine();
  useSoundEngine();

  const isDev = !import.meta.env.PROD;

  // ------------------------------------------------------------
  // RENDER — Unified Cinematic Structure
  // ------------------------------------------------------------
  return (
    <div className="layout-root">

      <Header />

      {/* ⭐ Unified Cinematic Zone */}
      <section className="cinematic-zone">
        <Background3D />

        {/* ⭐ Hero Crown MUST be inside the cinematic zone */}
        <HeroCrown />

        {/* ⭐ Page content inside cinematic zone */}
        <div className="cinematic-content">
          {children}
        </div>
      </section>

      <Footer />

      <ThemePanel />
      {isDev && <CorePanel />}

    </div>
  );
}
