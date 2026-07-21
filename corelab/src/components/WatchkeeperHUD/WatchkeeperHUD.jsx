// ============================================================
// WatchkeeperHUD.jsx — Dev Diagnostics Drawer (GR1 Stable)
// ============================================================

import React, { useState, useEffect } from "react";
import "./watchkeeper-hud.css";

export default function WatchkeeperHUD() {
  const [open, setOpen] = useState(false);
  const [dataDump, setDataDump] = useState(null);

  // ------------------------------------------------------------
  // Toggle HUD with Shift + W
  // ------------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      try {
        if (e.shiftKey && e.key.toLowerCase() === "w") {
          setOpen((prev) => !prev);
        }
      } catch {
        // Prevent key handler crash
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ------------------------------------------------------------
  // Fetch live diagnostics (sentinel tree)
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/sentinel/sentinel-tree.txt");

        if (!res.ok) {
          throw new Error("Sentinel tree missing");
        }

        const text = await res.text();

        setDataDump({
          timestamp: new Date().toISOString(),
          sentinelTree: text,
        });
      } catch (err) {
        setDataDump({
          error: "Unable to load diagnostics",
          detail: err.message,
        });
      }
    }

    if (open) loadData();
  }, [open]);

  // ------------------------------------------------------------
  // Hide HUD for public users
  // ------------------------------------------------------------
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.search.includes("dev=true");

  if (!isDev) return null;

  // ------------------------------------------------------------
  // Render HUD
  // ------------------------------------------------------------
  return (
    <div className={`wk-hud ${open ? "open" : ""}`}>
      <div className="wk-header">
        <span>Watchkeeper HUD</span>
        <button onClick={() => setOpen(false)}>Close</button>
      </div>

      <div className="wk-content">
        <h3>Live Diagnostics Snapshot</h3>
        <pre>{JSON.stringify(dataDump, null, 2)}</pre>
      </div>
    </div>
  );
}
