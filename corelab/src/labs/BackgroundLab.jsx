// ============================================================
// BackgroundLab.jsx — Isolated Background3D Test Environment (GR2)
// ============================================================

import Background3D from "../components/Background3D.jsx";

export default function BackgroundLab() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative"
      }}
    >
      <Background3D />
    </div>
  );
}
