// ============================================================
// TestPageLab.jsx — Fullscreen Adaptive 16:9 Background Video
// ============================================================

export default function TestPageLab() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
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
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100vw",
          height: "56.25vw",
          maxHeight: "100vh",
          maxWidth: "177.78vh",
          transform: "translate(-50%, -50%)",
          objectFit: "cover"
        }}
      />
    </div>
  );
}
