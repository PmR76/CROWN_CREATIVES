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

  useThemeEngine();
  useSoundEngine();

  const isDev = !import.meta.env.PROD;

  return (
    <div className="layout-root">

      <Header />

      <main className="page-content">
        {children}
      </main>

      {/* ⭐ GLOBAL HERO ELEMENTS */}
      <HeroCrown />
      <HeroGallery />
      <Ticker />

      <Footer />

      <ThemePanel />
      {isDev && <CorePanel />}
    </div>
  );
}
