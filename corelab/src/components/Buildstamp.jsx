// ============================================================
// Buildstamp.jsx — Runtime Build Tag (GR1 Stable)
// ============================================================

import React from "react";
import "./buildstamp.css";

export default function Buildstamp() {
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.search.includes("dev=true");

  // Prevent runtime crash on SSR or hydration edge cases
  const builtTime = (() => {
    try {
      return new Date().toLocaleString();
    } catch {
      return "unknown";
    }
  })();

  const stamp = {
    version: "v1.0.0",
    built: builtTime,
    env: isDev ? "dev" : "prod",
  };

  return (
    <div className="buildstamp">
      Crown Creatives · {stamp.version} · {stamp.built}
      {isDev && (
        <span className="dev-info"> · env:{stamp.env}</span>
      )}
    </div>
  );
}
