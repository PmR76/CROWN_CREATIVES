// ============================================================
// TestPageLab.jsx — Temporary Construction Page (Mini Viewport)
// ============================================================

export default function TestPageLab() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "360px",
        height: "240px",
        borderRadius: "12px",
        overflow: "hidden",
        zIndex: 9999,
        pointerEvents: "none",   // allows clicking modules behind it
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
