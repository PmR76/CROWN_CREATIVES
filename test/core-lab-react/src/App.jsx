// ============================================================
// App.jsx — Global Application Wrapper (GR1 — Corrected Layout)
// ============================================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";

// Sentinel v2.0 Dashboard
import SentinelRoute from "./sentinel/dashboard/SentinelRoute";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sentinel" element={<SentinelRoute />} />
        </Routes>
      </Layout>
    </Router>
  );
}
