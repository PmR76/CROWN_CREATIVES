// ============================================================
// Layout.jsx — Global Cinematic Frame for Crown Creatives (GR1)
// ============================================================

import Header from "./Header";
import Footer from "./Footer";
import ThemePanel from "./ThemePanel";
import CorePanel from "./CorePanel";
import Background3D from "./Background3D";

import { useThemeEngine } from "../hooks/useThemeEngine";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Layout({ children }) {

  // ------------------------------------------------------------
  // HOOKS — MUST BE TOP LEVEL AND ALWAYS IN SAME ORDER
  // ------------------------------------------------------------
  useThemeEngine();
  useSoundEngine();

  const isDev = !import.meta.env.PROD;

  // ------------------------------------------------------------
  // RENDER — PURE JSX, NO HOOKS, NO STATE UPDATES
  // ------------------------------------------------------------
  return (
    <div className="layout-root">

      <Header />

      {/* ⭐ 3D Background — Mounted Immediately Under Header */}
      <Background3D />

      <main className="page-content">
        {children}
      </main>

      <Footer />

      <ThemePanel />

      {isDev && <CorePanel />}

    </div>
  );
}
