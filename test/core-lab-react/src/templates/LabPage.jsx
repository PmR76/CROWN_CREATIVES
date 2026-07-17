import Header from "../components/Header";
import Background3D from "../components/Background3D"
import Footer from "../components/Footer";
import Ticker from "../components/Ticker";
import HeroCrown from "../components/HeroCrown";
import HeroGallery from "../components/HeroGallery";
import { useThemeEngine } from "../hooks/useThemeEngine";
import { useSoundEngine } from "../hooks/useSoundEngine";
import CorePanel from "../components/CorePanel";
import ThemePanel from "../components/ThemePanel";

export default function LabPage({ title, children }) {
  // Theme + Sound engines activate automatically
  useThemeEngine();
  useSoundEngine();

  const isDev = !import.meta.env.PROD;

  return (
    <div className="lab-page">
      <Background3D />
      <Header />

      <main className="lab-content">
        {children}
      </main>

      <HeroCrown />
      <HeroGallery />
      <Ticker />
      <Footer />

      {/* Admin Theme Panel — FIXED */}
      <ThemePanel />

      {isDev && <CorePanel />}
    </div>
  );
}
