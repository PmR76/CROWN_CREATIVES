// ============================================================
// HomeLab.jsx — GR3 Composition Lab
// ============================================================

import ModuleStreamer from "../labs/ModuleStreamer.jsx";

export default function HomeLab() {
  return (
    <div className="lab-shell">
      <ModuleStreamer inject="header" />
      <ModuleStreamer inject="crown" />
      <ModuleStreamer inject="gallery" />
    </div>
  );
}
