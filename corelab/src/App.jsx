import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main site pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import Projects from "./pages/Projects.jsx";
import Videos from "./pages/Videos.jsx";
import Podcasts from "./pages/Podcasts.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";

// HUD
import WatchkeeperHUD from "./components/WatchkeeperHUD/WatchkeeperHUD.jsx";

// GR3 Sandbox
import LabHome from "./pages/LabHome.jsx";

// GR2 Module Labs
import HeaderLab from "./labs/HeaderLab.jsx";
import HeroCrownLab from "./labs/HeroCrownLab.jsx";
import GalleryLab from "./labs/GalleryLab.jsx";
import CardsLab from "./labs/CardsLab.jsx";
import TickerLab from "./labs/TickerLab.jsx";
import FooterLab from "./labs/FooterLab.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <WatchkeeperHUD />

      <Routes>
        {/* Main Site */}
        <Route path="/" element={<Home />} />
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
