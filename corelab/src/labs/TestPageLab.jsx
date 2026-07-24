// ============================================================
// TestPageLab.jsx — Temporary Construction Page (GR3)
// ============================================================

export default function TestPageLab() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        background: "black"
      }}
    >
      <video
        src="/videos/CC-Test-Page.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover"
        }}
      />
    </div>
  );
}
