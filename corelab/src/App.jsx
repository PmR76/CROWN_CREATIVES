// ============================================================
// App.jsx — Core Lab OS Wrapper + Routes + Cosmic Background
// ============================================================

import React from "react";
import { Routes, Route } from "react-router-dom";

// OS Layout + Cosmic Background
import Layout from "./components/Layout.jsx";
import Background3D from "./components/Background3D.jsx";

// Watchkeeper HUD (global overlay)
import WatchkeeperHUD from "./components/WatchkeeperHUD/WatchkeeperHUD.jsx";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Blog from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import Gallery from "./pages/Gallery.jsx";
import Podcasts from "./pages/Podcasts.jsx";
import Projects from "./pages/Projects.jsx";
import Videos from "./pages/Videos.jsx";

export default function App() {
  return (
    <>
      {/* GLOBAL COSMIC BACKDROP */}
      <Background3D />

      {/* GLOBAL HUD OVERLAY */}
      <WatchkeeperHUD />

      {/* OS-LIKE LAYOUT SHELL */}
      <Layout>
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
      </Layout>
    </>
  );
}
