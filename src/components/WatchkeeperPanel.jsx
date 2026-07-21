import { useState, useEffect, useRef } from "react";

const DEV_BASE = "http://localhost:5175";
const DEV_PREVIEW = "http://localhost:5173";

// Static, production-safe endpoints
const PROD_STATUS_URL = "/sentinel-prod.json";
const PROD_FILETREE_URL = "/sentinel-filetree.json";

export default function WatchkeeperPanel() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileTree, setFileTree] = useState(null);
  const [status, setStatus] = useState(null);
  const [handshake, setHandshake] = useState(null);
  const [visible, setVisible] = useState(true);

  // Draggable panel
  const panelRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isProd =
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  function onMouseDown(e) {
    setDragging(true);
    setOffset({
      x: e.clientX - panelRef.current.offsetLeft,
      y: e.clientY - panelRef.current.offsetTop
    });
  }

  function onMouseMove(e) {
    if (!dragging) return;
    panelRef.current.style.left = `${e.clientX - offset.x}px`;
    panelRef.current.style.top = `${e.clientY - offset.y}px`;
  }

  function onMouseUp() {
    setDragging(false);
  }

  // Sentinel status (dev: backend, prod: static)
  async function loadStatus() {
    const url = isProd ? PROD_STATUS_URL : `${DEV_BASE}/sentinel/status`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      setStatus(json);
    } catch (err) {
      if (isProd) {
        setStatus({
          env: "prod",
          status: "OK",
          ok: true,
          message:
            "Sentinel backend disabled in production. Using static status snapshot."
        });
      } else {
        setStatus({ error: String(err) });
      }
    }
  }

  // Sentinel handshake (dev only, prod: controlled no-op)
  async function runHandshake() {
    if (isProd) {
      setHandshake({
        env: "prod",
        finalStatus: "STATIC",
        message:
          "Handshake disabled in production. Live pipeline controlled via core-lab registry."
      });
      return;
    }

    try {
      const res = await fetch(`${DEV_BASE}/sentinel/handshake`);
      const json = await res.json();
      setHandshake(json);
    } catch (err) {
      setHandshake({ error: String(err) });
    }
  }

  // File tree (dev: live backend, prod: static snapshot)
  async function loadTree() {
    const url = isProd ? PROD_FILETREE_URL : `${DEV_BASE}/sentinel/filetree`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      setFileTree(json);
    } catch (err) {
      if (isProd) {
        setFileTree({
          error:
            "Static file tree not available. Core-lab registry controls live pipeline."
        });
      } else {
        setFileTree({ error: String(err) });
      }
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  if (!visible) return null;

  const envLabel = isProd
    ? "Production (Static / Registry Mode)"
    : "Development (Live Backend Mode)";

  return (
    <div
      ref={panelRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "420px",
        background: "#111",
        border: "2px solid #0f0",
        padding: "15px",
        color: "#0f0",
        zIndex: 9999,
        cursor: dragging ? "grabbing" : "grab",
        borderRadius: "8px",
        boxShadow: "0 0 20px #0f0"
      }}
    >
      <h2 style={{ marginTop: 0 }}>SENTINEL WATCHKEEPER</h2>
      <div style={{ marginBottom: "8px", fontSize: "0.9rem" }}>
        Environment: {envLabel}
      </div>

      {/* Sentinel Status */}
      <div style={{ marginBottom: "10px" }}>
        {status?.error ? (
          <div>Error: {status.error}</div>
        ) : status ? (
          <>
            {status.dev && status.prod ? (
              <>
                <div>
                  Dev: {status.dev.status} ({status.dev.durationMs}ms)
                </div>
                <div>
                  Prod: {status.prod.status} ({status.prod.durationMs}ms)
                </div>
              </>
            ) : (
              <>
                <div>Env: {status.env}</div>
                <div>Status: {status.status}</div>
                {status.message && <div>Message: {status.message}</div>}
              </>
            )}
          </>
        ) : (
          <div>Loading status...</div>
        )}
      </div>

      <button onClick={runHandshake}>RUN SENTINEL HANDSHAKE</button>

      {handshake && (
        <pre
          style={{
            background: "#222",
            color: "#0f0",
            padding: "8px",
            marginTop: "8px",
            maxHeight: "120px",
            overflow: "auto",
            border: "1px solid #0f0"
          }}
        >
          {JSON.stringify(handshake, null, 2)}
        </pre>
      )}

      {/* Preview */}
      <h3>Preview</h3>
      <button
        onClick={() => setPreviewOpen(!previewOpen)}
        disabled={isProd}
        style={{
          opacity: isProd ? 0.6 : 1,
          cursor: isProd ? "not-allowed" : "pointer"
        }}
      >
        {previewOpen ? "Close Preview" : isProd ? "Preview (Dev Only)" : "Open Preview"}
      </button>

      {previewOpen && !isProd && (
        <iframe
          src={DEV_PREVIEW}
          width="100%"
          height="200"
          style={{ marginTop: "10px", border: "1px solid #0f0" }}
        ></iframe>
      )}

      {/* File Tree */}
      <h3>Project File Tree</h3>
      <button onClick={loadTree}>
        {isProd ? "Load Static File Tree" : "Load File Tree"}
      </button>

      <pre
        style={{
          background: "#222",
          color: "#0f0",
          padding: "10px",
          maxHeight: "200px",
          overflow: "auto",
          border: "1px solid #0f0",
          marginTop: "10px"
        }}
      >
        {fileTree
          ? JSON.stringify(fileTree, null, 2)
          : "Click 'Load File Tree' to fetch project structure..."}
      </pre>

      <button
        onClick={() => setVisible(false)}
        style={{ marginTop: "10px", background: "#400", borderColor: "#f00" }}
      >
        Hide Panel
      </button>
    </div>
  );
}
