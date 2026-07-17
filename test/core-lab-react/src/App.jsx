// ============================================================
// App.jsx — Global Application Wrapper (GR1 — Corrected Layout)
// ============================================================

import Layout from "./components/Layout";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      {/* Global layout wrapper: header, footer, theme, etc */}
      <Layout />

      {/* Homepage content lives OUTSIDE the cinematic zone */}
      <Home />
    </>
  );
}
