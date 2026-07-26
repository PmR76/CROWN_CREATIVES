// ============================================================
// LabCrown.jsx — Crown Lab with Header Included
// ============================================================

import Header from "../components/Header.jsx";
import HeroCrownLab from "../labs/HeroCrownLab.jsx";

export default function LabCrown() {
  return (
    <div className="lab-shell">
      <Header />

      <div style={{ marginTop: "120px", textAlign: "center" }}>
        <HeroCrownLab />
      </div>
    </div>
  );
}
