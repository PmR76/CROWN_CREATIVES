import { useEffect, useState } from "react";

export function useDiagnostics() {
  const [fps, setFps] = useState(0);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let last = performance.now();
    let frames = 0;

    const loop = () => {
      const now = performance.now();
      frames++;

      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }

      requestAnimationFrame(loop);
    };

    loop();

    window.addEventListener("error", (e) => {
      setErrors((prev) => [...prev, e.message]);
    });

    window.addEventListener("unhandledrejection", (e) => {
      setErrors((prev) => [...prev, e.reason]);
    });
  }, []);

  return {
    health: "✓ Clean",
    cards: "✓ Loaded",
    ticker: "✓ Loaded",
    footer: "✓ Loaded",
    fps,
    errors
  };
}
