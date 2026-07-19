// ============================================================
// App.jsx — Global Application Wrapper with Routes + Watchkeeper
// ============================================================

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Podcasts from "./pages/Podcasts";
import Projects from "./pages/Projects";
import Videos from "./pages/Videos";

import WatchkeeperPanel from "./components/WatchkeeperPanel";

export default function App() {
  return (
    <>
      {/* ROUTES — your main site */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>

      {/* WATCHKEEPER — draggable dev HUD overlay */}
      <WatchkeeperPanel />
    </>
  );
}
