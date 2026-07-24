// ============================================================
// FooterLab.jsx — Isolated Footer Test Environment (GR2)
// ============================================================

import Footer from "../components/Footer.jsx";

export default function FooterLab() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "40px"
      }}
    >
      <Footer />
    </div>
  );
}
