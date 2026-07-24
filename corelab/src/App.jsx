import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import Projects from "./pages/Projects.jsx";
import Videos from "./pages/Videos.jsx";
import Podcasts from "./pages/Podcasts.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";

import LabHome from "./pages/LabHome.jsx";

// GR2 Labs
import HeaderLab from "./labs/HeaderLab.jsx";

import WatchkeeperHUD from "./components/WatchkeeperHUD/WatchkeeperHUD.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <WatchkeeperHUD />

      <Routes>
        {/* MAIN SITE ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />

        {/* LAB ROUTES — GR2 isolated environments */}
        <Route path="/lab-home" element={<LabHome />} />
        <Route path="/lab-header" element={<HeaderLab />} />
      </Routes>
    </BrowserRouter>
  );
}
