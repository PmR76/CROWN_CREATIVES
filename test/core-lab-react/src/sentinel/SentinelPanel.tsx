import React, { useState } from "react";
import { useSentinelStatus, triggerSentinelHandshake } from "./useSentinel";

export function SentinelPanel() {
  const sentinel = useSentinelStatus();
  const [handshakeResult, setHandshakeResult] = useState<any>(null);
  const [handshakeLoading, setHandshakeLoading] = useState(false);

  async function handleHandshake() {
    setHandshakeLoading(true);
    try {
      const result = await triggerSentinelHandshake();
      setHandshakeResult(result);
    } catch (err) {
      console.error("Sentinel handshake error", err);
    } finally {
      setHandshakeLoading(false);
      sentinel.refresh();
    }
  }

  const box = {
    padding: "6px 10px",
    borderRadius: "6px",
    marginTop: "4px",
    fontSize: "11px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)"
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "14px 18px",
        borderRadius: "14px",
        background: "rgba(10, 10, 20, 0.92)",
        color: "#fff",
        fontSize: "12px",
        zIndex: 99999,
        width: "240px",
        boxShadow: "0 0 22px rgba(0, 200, 255, 0.55)",
        backdropFilter: "blur(8px)"
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "10px", letterSpacing: "0.08em" }}>
        SENTINEL WATCHKEEPER
      </div>

      <div style={box}>
        {sentinel.loading && <div>Checking status…</div>}
        {sentinel.error && <div style={{ color: "#ff8080" }}>Error: {String(sentinel.error)}</div>}

        {sentinel.status && (
          <div>
            <div>
              <strong>Dev:</strong>{" "}
              <span style={{ color: sentinel.status.dev.ok ? "#00eaff" : "#ff8080" }}>
                {sentinel.status.dev.status} ({sentinel.status.dev.durationMs}ms)
              </span>
            </div>

            <div>
              <strong>Prod:</strong>{" "}
              <span style={{ color: sentinel.status.prod.ok ? "#00eaff" : "#ff8080" }}>
                {sentinel.status.prod.status} ({sentinel.status.prod.durationMs}ms)
              </span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleHandshake}
        disabled={handshakeLoading}
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #00c9ff, #7f00ff)",
          color: "#fff",
          fontSize: "12px",
          letterSpacing: "0.08em",
          width: "100%"
        }}
      >
        {handshakeLoading ? "RUNNING…" : "RUN SENTINEL HANDSHAKE"}
      </button>

      {handshakeResult && (
        <div
          style={{
            marginTop: "10px",
            maxHeight: "180px",
            overflow: "auto",
            fontSize: "10px",
            background: "rgba(255,255,255,0.04)",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(handshakeResult.compare, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
