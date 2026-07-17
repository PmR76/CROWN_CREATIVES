// ============================================================
// App.jsx — Global Application Wrapper (GR1 — Corrected Layout)
// ============================================================

import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";

// Sentinel v2.0 Dashboard
import SentinelRoute from "./sentinel/dashboard/SentinelRoute";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sentinel" element={<SentinelRoute />} />
      </Routes>
    </Layout>
  );
}
