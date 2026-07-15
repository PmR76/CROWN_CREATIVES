// ============================================================
// Layout.jsx — Global Cinematic Frame for Crown Creatives (GR1)
// ============================================================

import Header from "./Header";
import Footer from "./Footer";
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

      <Footer />

      <ThemePanel />
      {isDev && <CorePanel />}

    </div>
  );
}
