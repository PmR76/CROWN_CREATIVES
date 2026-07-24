// ============================================================
// HeroCrownLab.jsx — Isolated Crown Test Environment (GR2)
// ============================================================

import HeroCrown from "../components/HeroCrown.jsx";

export default function HeroCrownLab() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "40px"
      }}
    >
      <HeroCrown />
    </div>
  );
}
