// ============================================================
// LabHome.jsx — GR3 Composition Sandbox (Blank Until Streamed)
// ============================================================

import { useState, useEffect } from "react";
import ModuleStreamer from "../labs/ModuleStreamer.jsx";

export default function LabHome() {
  const [inject, setInject] = useState(null);

  // Listen for Watchkeeper streaming events
  useEffect(() => {
    const handler = (e) => setInject(e.detail);
    window.addEventListener("stream-module", handler);
    return () => window.removeEventListener("stream-module", handler);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "transparent"
      }}
    >
      {/* Render nothing until a module is streamed */}
      {inject && <ModuleStreamer inject={inject} />}
    </div>
  );
}
