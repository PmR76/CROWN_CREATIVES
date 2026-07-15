// ============================================================
// Background3D.jsx — GR1 Cinematic Nebula Pulse + Crown Sync
// ============================================================

import { useEffect, useRef } from "react";
import { useThemeEngine } from "../hooks/useThemeEngine";

export default function Background3D() {
  const canvasRef = useRef(null);
  const { theme } = useThemeEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Resize canvas
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ------------------------------------------------------------
    // STARFIELD — Swirl + Depth + Trails
    // ------------------------------------------------------------
    const stars = [];
    const starCount = 350;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1.8 + 0.3,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.003 + 0.001,
      });
    }

    // ------------------------------------------------------------
    // NEBULA — Drift + Pulse + Magical Shimmer
    // ------------------------------------------------------------
    const nebula = [];
    const nebulaCount = 5;

    for (let i = 0; i < nebulaCount; i++) {
      nebula.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 400 + 250,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
        shimmerOffset: Math.random() * Math.PI * 2,
      });
    }

    // Pulse timer
    let pulseTime = 0;

    // Crown sync (reads CSS variable)
    function getCrownGlow() {
      const glow = getComputedStyle(document.body)
        .getPropertyValue("--crown-glow")
        .trim();

      return glow ? parseFloat(glow) : 1;
    }

    // ------------------------------------------------------------
    // RENDER LOOP — Transparent canvas
    // ------------------------------------------------------------
    function render() {
      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas (transparent)
      ctx.clearRect(0, 0, w, h);

      // ------------------------------------------------------------
      // Nebula Pulse — breathing luminosity wave
      // ------------------------------------------------------------
      pulseTime += 0.005;

      const themePulse = 1 + Math.sin(pulseTime) * 0.15;
      const crownPulse = getCrownGlow() * 0.2 + 1;
      const combinedPulse = themePulse * crownPulse;

      // ------------------------------------------------------------
      // Draw nebula (drift + pulse + shimmer)
      // ------------------------------------------------------------
      for (let n of nebula) {
        n.x += n.dx;
        n.y += n.dy;

        // Wrap edges
        if (n.x < -n.r) n.x = w + n.r;
        if (n.x > w + n.r) n.x = -n.r;
        if (n.y < -n.r) n.y = h + n.r;
        if (n.y > h + n.r) n.y = -n.r;

        // Magical shimmer
        n.shimmerOffset += 0.002;
        const shimmer = 1 + Math.sin(n.shimmerOffset) * 0.1;

        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);

        if (theme === "night") {
          gradient.addColorStop(
            0,
            `rgba(120, 80, 255, ${0.35 * combinedPulse * shimmer})`
          );
          gradient.addColorStop(1, "rgba(20, 10, 40, 0)");
        } else {
          gradient.addColorStop(
            0,
            `rgba(255, 200, 150, ${0.25 * combinedPulse * shimmer})`
          );
          gradient.addColorStop(1, "rgba(255, 230, 200, 0)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------------------------
      // Draw stars (swirl + depth + trails)
      // ------------------------------------------------------------
      for (let s of stars) {
        s.angle += s.speed;
        s.x += Math.cos(s.angle) * s.z;
        s.y += Math.sin(s.angle) * s.z;

        // Wrap edges
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        // Star color
        ctx.fillStyle =
          theme === "night"
            ? "rgba(120,200,255,0.9)"
            : "rgba(255,255,255,0.6)";

        ctx.fillRect(s.x, s.y, 2 * s.z, 2 * s.z);

        // Trails
        ctx.fillStyle =
          theme === "night"
            ? "rgba(120,200,255,0.25)"
            : "rgba(255,255,255,0.15)";

        ctx.fillRect(
          s.x - Math.cos(s.angle) * 4,
          s.y - Math.sin(s.angle) * 4,
          2 * s.z,
          2 * s.z
        );
      }

      requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="background-3d" />;
}
