// ============================================================
// CardsLab.jsx — Isolated Frosted Cards Test Environment (GR2)
// ============================================================

import FrostedCards from "../components/FrostedCards.jsx";

export default function CardsLab() {
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
      <FrostedCards />
    </div>
  );
}
