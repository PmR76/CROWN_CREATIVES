// ============================================================
// LabHome.jsx — GR3 Composition Sandbox (Blank Until Streamed)
// ============================================================

import { useState, useEffect } from "react";
import ModuleStreamer from "../labs/ModuleStreamer.jsx";

export default function LabHome() {
  const [inject, setInject] = useState(null);

  useEffect(() => {
    const handler = (e) => setInject(e.detail);
    window.addEventListener("stream-module", handler);
    return () => window.removeEventListener("stream-module", handler);
  }, []);

  return (
    <div className="lab-shell">
      {inject && <ModuleStreamer inject={inject} />}
    </div>
  );
}
