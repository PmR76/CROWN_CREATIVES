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
  // Snapshot Handler (Dev-only)
  // ------------------------------------------------------------
async function handleSnapshot() {
  try {
    const res = await fetch("/sentinel/sentinel-tree.txt");
    const text = await res.text();

    const snapshot = {
      timestamp: new Date().toISOString(),
      sentinelTree: text,
      status: "OK"
    };

    console.log("Watchkeeper Snapshot:", snapshot);
    setDataDump(snapshot);   // show snapshot inside HUD
  } catch (err) {
    console.error("Snapshot failed:", err);
    setDataDump({
      error: "Snapshot failed",
      detail: err.message
    });
  }
}

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
      </div>

      {/* Snapshot Button Section */}
      <div className="wk-section">
        <div className="wk-label">Snapshot</div>
        <button className="wk-btn" onClick={handleSnapshot}>
          Take Snapshot
        </button>
      </div>

      <div className="wk-content">
        <h3>Live Diagnostics Snapshot</h3>
        <pre>{JSON.stringify(dataDump, null, 2)}</pre>
      </div>
    </div>
  );
}
// ------------------------------------------------------------
// Draggable HUD (calm, ND-friendly)
// ------------------------------------------------------------
useEffect(() => {
  if (!open) return;

  const hud = document.querySelector(".wk-hud");
  if (!hud) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const onMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX - hud.offsetLeft;
    startY = e.clientY - hud.offsetTop;
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    hud.style.left = `${e.clientX - startX}px`;
    hud.style.top = `${e.clientY - startY}px`;
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  hud.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  return () => {
    hud.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}, [open]);
