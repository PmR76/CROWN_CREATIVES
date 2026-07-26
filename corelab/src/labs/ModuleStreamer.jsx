// C:\DEV\CROWN_CREATIVES\corelab\src\labs\ModuleStreamer.jsx

import { useEffect, useState } from "react";
import { modules } from "./moduleRegistry.js";

export default function ModuleStreamer() {
  const [activeModules, setActiveModules] = useState([]);

  useEffect(() => {
    // Mark GR3 as active for diagnostics
    window.__MODULE_STREAMER_ACTIVE = true;
    window.__GR3_ACTIVE = true;

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

      setActiveModules((prev) =>
        prev.includes(detail) ? prev : [...prev, detail]
      );
    };

    window.addEventListener("stream-module", handler);
    return () => {
      window.removeEventListener("stream-module", handler);
      window.__MODULE_STREAMER_ACTIVE = false;
      window.__GR3_ACTIVE = false;
    };
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
