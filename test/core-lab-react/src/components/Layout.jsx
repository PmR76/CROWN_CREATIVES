// Layout.jsx — GR1 Unified Cinematic Zone

import Header from "./Header";
import Footer from "./Footer";
import ThemePanel from "./ThemePanel";
import CorePanel from "./CorePanel";
import Background3D from "./Background3D";
import HeroCrown from "./HeroCrown";
import { useThemeEngine } from "../hooks/useThemeEngine";
import { useSoundEngine } from "../hooks/useSoundEngine";

export default function Layout({ children }) {
  useThemeEngine();
  useSoundEngine();
  const isDev = !import.meta.env.PROD;

  return (
    <div className="layout-root">
      <Header />

      <section className="cinematic-zone">
        <Background3D />

        <HeroCrown />

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
