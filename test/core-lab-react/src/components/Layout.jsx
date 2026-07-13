// ============================================================
// Layout.jsx — Global Cinematic Frame for Crown Creatives
// ============================================================

import Header from "./Header";
import Footer from "./Footer";
import HeroCrown from "./HeroCrown";
import HeroGallery from "./HeroGallery";
import Ticker from "./Ticker";
import ThemePanel from "./ThemePanel";
import CorePanel from "./CorePanel";

import { useThemeEngine } from "../hooks/useThemeEngine";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Layout({ children }) {

  // ⭐ Global engines (theme + sound)
  useThemeEngine();
  useSoundEngine();

  const isDev = !import.meta.env.PROD;

  return (
    <div className="layout-root">

      {/* ⭐ Global Header */}
      <Header />

      {/* ⭐ Page Content */}
      <main className="page-content">
        {children}
      </main>

      {/* ⭐ Global Cinematic Elements */}
      <HeroCrown />
      <HeroGallery />
      <Ticker />

      {/* ⭐ Global Footer */}
      <Footer />

      {/* ⭐ Admin Theme Panel */}
      <ThemePanel />

      {/* ⭐ Dev Diagnostics */}
      {isDev && <CorePanel />}
    </div>
  );
}
