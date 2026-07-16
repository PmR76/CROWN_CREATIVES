import React, { useState } from 'react';
import { useSentinelStatus, triggerSentinelHandshake } from './useSentinel';

export function SentinelPanel() {
  const { status, loading, error, refresh } = useSentinelStatus();
  const [handshakeResult, setHandshakeResult] = useState(null);
  const [handshakeLoading, setHandshakeLoading] = useState(false);

  async function handleHandshake() {
    setHandshakeLoading(true);
    try {
      const result = await triggerSentinelHandshake();
      setHandshakeResult(result);
    } catch (err) {
      console.error('Sentinel handshake error', err);
    } finally {
      setHandshakeLoading(false);
      refresh();
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        padding: '12px 16px',
        borderRadius: 12,
        background: 'rgba(10, 10, 20, 0.9)',
        color: '#fff',
        fontSize: 12,
        zIndex: 99999,
        boxShadow: '0 0 18px rgba(0, 200, 255, 0.6)'
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 'bold', letterSpacing: '0.08em' }}>
        SENTINEL WATCHKEEPER
      </div>

      {loading ? (
        <div>Loading status…</div>
      ) : error ? (
        <div style={{ color: '#ff8080' }}>Error: {String(error)}</div>
      ) : status ? (
        <div style={{ marginBottom: 8 }}>
          <div>Dev: {status.dev.status} ({status.dev.durationMs} ms)</div>
          <div>Prod: {status.prod.status} ({status.prod.durationMs} ms)</div>
        </div>
      ) : (
        <div>No status yet.</div>
      )}

      <button
        onClick={handleHandshake}
        disabled={handshakeLoading}
        style={{
          marginTop: 6,
          padding: '6px 10px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #00c9ff, #7f00ff)',
          color: '#fff',
          fontSize: 11,
          letterSpacing: '0.08em'
        }}
      >
        {handshakeLoading ? 'RUNNING SENTINEL…' : 'RUN SENTINEL HANDSHAKE'}
      </button>

      {handshakeResult && (
        <div style={{ marginTop: 8, maxHeight: 160, overflow: 'auto', fontSize: 10 }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(handshakeResult.compare, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
