import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { LIVE_PAGE } from "./live/livePointer.js";

import Background3D from "./components/Background3D.jsx";
import "./theme-panel/themePanel.js";
import "./theme-panel/themePanel.css";

import WatchkeeperHUD from "./components/WatchkeeperHUD/WatchkeeperHUD.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import Projects from "./pages/Projects.jsx";
import Videos from "./pages/Videos.jsx";
import Podcasts from "./pages/Podcasts.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";

import LabHome from "./pages/LabHome.jsx";

import HeaderLab from "./labs/HeaderLab.jsx";
import HeroCrownLab from "./labs/HeroCrownLab.jsx";
import GalleryLab from "./labs/GalleryLab.jsx";
import CardsLab from "./labs/CardsLab.jsx";
import TickerLab from "./labs/TickerLab.jsx";
import FooterLab from "./labs/FooterLab.jsx";
import TestPageLab from "./labs/TestPageLab.jsx";

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
    if (window.initThemePanel) window.initThemePanel();
  }, []);

  return (
    <BrowserRouter>
      <Background3D />
      <WatchkeeperHUD />

      <Routes>
        <Route path="/" element={liveMap[LIVE_PAGE]} />

        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />

        <Route path="/lab-home" element={<LabHome />} />
        <Route path="/lab-header" element={<HeaderLab />} />
        <Route path="/lab-crown" element={<HeroCrownLab />} />
        <Route path="/lab-gallery" element={<GalleryLab />} />
        <Route path="/lab-cards" element={<CardsLab />} />
        <Route path="/lab-ticker" element={<TickerLab />} />
        <Route path="/lab-footer" element={<FooterLab />} />
        <Route path="/lab-test-page" element={<TestPageLab />} />
      </Routes>
    </BrowserRouter>
  );
}
