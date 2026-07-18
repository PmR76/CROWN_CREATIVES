import { useState, useEffect, useRef } from "react";

export default function SentinelWatchkeeper() {
  const [visible, setVisible] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileTree, setFileTree] = useState(null);
  const [status, setStatus] = useState(null);
  const [handshake, setHandshake] = useState(null);

  // Draggable panel
  const panelRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  // Sentinel status
  async function loadStatus() {
    try {
      const res = await fetch("http://localhost:5175/sentinel/status");
      const json = await res.json();
      setStatus(json);
    } catch (err) {
      setStatus({ error: String(err) });
    }
  }

  // Sentinel handshake
  async function runHandshake() {
    try {
      const res = await fetch("http://localhost:5175/sentinel/handshake");
      const json = await res.json();
      setHandshake(json);
    } catch (err) {
      setHandshake({ error: String(err) });
    }
  }

  // File tree
  async function loadTree() {
    try {
      const res = await fetch("http://localhost:5175/sentinel/filetree");
      const json = await res.json();
      setFileTree(json);
    } catch (err) {
      setFileTree({ error: String(err) });
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  if (!visible) return null;

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
        width: "380px",
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

      {/* Sentinel Status */}
      <div style={{ marginBottom: "10px" }}>
        {status?.error ? (
          <div>Error: {status.error}</div>
        ) : status ? (
          <>
            <div>Dev: {status.dev.status} ({status.dev.durationMs}ms)</div>
            <div>Prod: {status.prod.status} ({status.prod.durationMs}ms)</div>
          </>
        ) : (
          <div>Loading status...</div>
        )}
      </div>

      <button onClick={runHandshake}>RUN SENTINEL HANDSHAKE</button>

      {/* Preview */}
      <h3>Preview</h3>
      <button onClick={() => setPreviewOpen(!previewOpen)}>
        {previewOpen ? "Close Preview" : "Open Preview"}
      </button>

      {previewOpen && (
        <iframe
          src="http://localhost:5173"
          width="100%"
          height="200"
          style={{ marginTop: "10px", border: "1px solid #0f0" }}
        ></iframe>
      )}

      {/* File Tree */}
      <h3>Project File Tree</h3>
      <button onClick={loadTree}>Load File Tree</button>

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
