// ============================================================
// ModuleStreamer.jsx — GR3 Multi‑Module Injection System
// ============================================================

import { useEffect, useState } from "react";
import { modules } from "./moduleRegistry.js";

export default function ModuleStreamer() {
  const [activeModules, setActiveModules] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail;

      if (detail === "clear") {
        setActiveModules([]);
        return;
      }

      if (detail === "all") {
        setActiveModules(Object.keys(modules));
        return;
      }

      // Add module if not already present
      setActiveModules((prev) =>
        prev.includes(detail) ? prev : [...prev, detail]
      );
    };

    window.addEventListener("stream-module", handler);
    return () => window.removeEventListener("stream-module", handler);
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100%" }}>
      {activeModules.map((key) => {
        const LazyModule = modules[key];
        if (!LazyModule) return null;

        const Component = LazyModule;
        return <Component key={key} />;
      })}
    </div>
  );
}
