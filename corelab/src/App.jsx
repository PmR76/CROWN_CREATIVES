// ============================================================
// App.jsx — CoreLab OS Routing + Background3D + Theme Panel + GR3 Streaming
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// LIVE pointer
import { LIVE_PAGE } from "./live/livePointer.js";

// Background + Theme Panel
import Background3D from "./components/Background3D.jsx";
import "./theme-panel/themePanel.js"; // auto‑registers SHIFT+T
import "./theme-panel/themePanel.css";

// HUD
import WatchkeeperHUD from "./components/WatchkeeperHUD/WatchkeeperHUD.jsx";

// Main site pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import Projects from "./pages/Projects.jsx";
import Videos from "./pages/Videos.jsx";
import Podcasts from "./pages/Podcasts.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";

// GR3 Sandbox
import LabHome from "./pages/LabHome.jsx";

// GR2 Module Labs
import HeaderLab from "./labs/HeaderLab.jsx";
import HeroCrownLab from "./labs/HeroCrownLab.jsx";
import GalleryLab from "./labs/GalleryLab.jsx";
import CardsLab from "./labs/CardsLab.jsx";
import TickerLab from "./labs/TickerLab.jsx";
import FooterLab from "./labs/FooterLab.jsx";
import TestPageLab from "./labs/TestPageLab.jsx";


// LIVE PAGE MAP — controls what goes live
const liveMap = {
  "test-page": <TestPageLab />,
  "home": <Home />,
  "header": <HeaderLab />,
  "crown": <HeroCrownLab />,
  "gallery": <GalleryLab />,
  "cards": <CardsLab />,
  "ticker": <TickerLab />,
  "footer": <FooterLab />,
};

export default function App() {
  useEffect(() => {
    // Initialize theme panel once
    if (window.initThemePanel) {
      window.initThemePanel();
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Background layer */}
      <Background3D />

      {/* HUD */}
      <WatchkeeperHUD />

      <Routes>
        {/* LIVE PAGE — controlled by livePointer.js */}
        <Route path="/" element={liveMap[LIVE_PAGE]} />

        {/* Main Site */}
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />

        {/* GR3 Sandbox */}
        <Route path="/lab-home" element={<LabHome />} />

        {/* GR2 Module Labs */}
        <Route path="/lab-header" element={<HeaderLab />} />
        <Route path="/lab-crown" element={<HeroCrownLab />} />
        <Route path="/lab-gallery" element={<GalleryLab />} />
        <Route path="/lab-cards" element={<CardsLab />} />
        <Route path="/lab-ticker" element={<TickerLab />} />
        <Route path="/lab-footer" element={<FooterLab />} />
        <Route path="/lab-test-page" element={<TestPageLab />} />

        {/* Page Labs */}
        <Route path="/lab-about" element={<About />} />
        <Route path="/lab-projects" element={<Projects />} />
        <Route path="/lab-videos" element={<Videos />} />
        <Route path="/lab-podcasts" element={<Podcasts />} />
        <Route path="/lab-contact" element={<Contact />} />
        <Route path="/lab-blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}
