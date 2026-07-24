// ============================================================
// HeaderLab.jsx — Isolated Header Test Environment (GR2)
// ============================================================

import Header from "../components/Header.jsx";

export default function HeaderLab() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "40px"
      }}
    >
      {/* LAB: Header only — no CoreHome, no Background3D, no global layout */}
      <Header />
    </div>
  );
}
