import { useEffect, useState } from "react";

export function useSentinelStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5175/sentinel/status");
      const json = await res.json();
      setStatus(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { status, loading, error, refresh };
}

export async function triggerSentinelHandshake() {
  const res = await fetch("http://localhost:5175/sentinel/handshake");
  return await res.json();
}
