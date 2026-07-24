import { useState, useEffect } from "react";
import { modules } from "./moduleRegistry.js";

export default function ModuleStreamer({ inject }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (inject && modules[inject]) {
      modules[inject]().then((mod) => {
        setComponent(() => mod.default);
      });
    }
  }, [inject]);

  return Component ? <Component /> : null;
}
