// ============================================================
// GalleryLab.jsx — Isolated Gallery Test Environment (GR2)
// ============================================================

import HeroGallery from "../components/HeroGallery.jsx";

export default function GalleryLab() {
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
      <HeroGallery />
    </div>
  );
}
