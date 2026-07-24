// ============================================================
// TestPageLab.jsx — Responsive 16:9 Construction Panel
// ============================================================

export default function TestPageLab() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",

        // Responsive width (desktop/tablet/mobile)
        width: "min(50vw, 480px)",   // max 480px, but shrinks on small screens

        // Maintain perfect 16:9 aspect ratio
        aspectRatio: "16 / 9",

        borderRadius: "12px",
        overflow: "hidden",
        zIndex: 9999,
        pointerEvents: "none", // allows clicking modules behind it
        boxShadow: "0 0 20px rgba(0,0,0,0.4)"
      }}
    >
      <video
        src="/videos/CC-Test-Page.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    </div>
  );
}
