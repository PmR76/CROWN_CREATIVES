import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Projects from "./pages/Projects";
import Videos from "./pages/Videos";
import Podcasts from "./pages/Podcasts";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

import Background3D from "./components/Background3D";
import { useThemeEngine } from "./hooks/useThemeEngine";

export default function App() {

  // ⭐ GLOBAL THEME ENGINE — REQUIRED
  useThemeEngine();

  return (
    <>
      {/* Global background */}
      <Background3D />

      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}
