// ============================================================
// SentinelPanel.tsx — Strict‑Mode Safe (Zero Errors)
// ============================================================

import React, { useState } from "react";
import { useSentinelStatus, triggerSentinelHandshake } from "./useSentinel";

export function SentinelPanel() {
  const { status, loading, error, refresh } = useSentinelStatus();

  const [handshakeResult, setHandshakeResult] = useState<any>(null);
  const [handshakeLoading, setHandshakeLoading] = useState(false);

  async function handleHandshake() {
    setHandshakeLoading(true);
    try {
      const result = await triggerSentinelHandshake();
      setHandshakeResult(result);
    } catch (e) {
      console.error("Sentinel handshake error", e);
    } finally {
      setHandshakeLoading(false);
      refresh();
    }
  }

  const box: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 6,
    marginTop: 4,
    fontSize: 11,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)"
  };

  // STRICT-MODE SAFE NARROWING
  const s = status;
  const h = handshakeResult;

  // ⭐ WORKAROUND: extract JSX into a function so TS stops collapsing to never
  function renderStatusBlock() {
    if (!s) return null;

    return (
      <div>
        <div>
          <strong>Dev:</strong>{" "}
          <span style={{ color: s.dev.ok ? "#00eaff" : "#ff8080" }}>
            {s.dev.status} ({s.dev.durationMs}ms)
          </span>
        </div>

        <div>
          <strong>Prod:</strong>{" "}
          <span style={{ color: s.prod.ok ? "#00eaff" : "#ff8080" }}>
            {s.prod.status} ({s.prod.durationMs}ms)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "14px 18px",
        borderRadius: 14,
        background: "rgba(10, 10, 20, 0.92)",
        color: "#fff",
        fontSize: 12,
        zIndex: 99999,
        width: 240,
        boxShadow: "0 0 22px rgba(0, 200, 255, 0.55)",
        backdropFilter: "blur(8px)"
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 10, letterSpacing: "0.08em" }}>
        SENTINEL WATCHKEEPER
      </div>

      <div style={box}>
        {loading && <div>Checking status…</div>}

        {error !== null && (
          <div style={{ color: "#ff8080" }}>Error: {String(error)}</div>
        )}

        {renderStatusBlock()}
      </div>

      <button
        onClick={handleHandshake}
        disabled={handshakeLoading}
        style={{
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #00c9ff, #7f00ff)",
          color: "#fff",
          fontSize: 12,
          letterSpacing: "0.08em",
          width: "100%"
        }}
      >
        {handshakeLoading ? "RUNNING…" : "RUN SENTINEL HANDSHAKE"}
      </button>

      {h && (
        <div
          style={{
            marginTop: 10,
            maxHeight: 180,
            overflow: "auto",
            fontSize: 10,
            background: "rgba(255,255,255,0.04)",
            padding: 8,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(h.compare, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
