// ============================================================
// TickerLab.jsx — Isolated Ticker Test Environment (GR2)
// ============================================================

import Ticker from "../components/Ticker.jsx";

export default function TickerLab() {
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
      <Ticker />
    </div>
  );
}
