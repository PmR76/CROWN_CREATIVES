// ============================================================
// Background3D.jsx — GR1 Cinematic Starfield + Nebula Layer
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
    // NEBULA — Soft drifting clouds
    // ------------------------------------------------------------
    const nebula = [];
    const nebulaCount = 5;

    for (let i = 0; i < nebulaCount; i++) {
      nebula.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 400 + 250, // radius
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
      });
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
      // Draw nebula (soft drifting clouds)
      // ------------------------------------------------------------
      for (let n of nebula) {
        n.x += n.dx;
        n.y += n.dy;

        // Wrap edges
        if (n.x < -n.r) n.x = w + n.r;
        if (n.x > w + n.r) n.x = -n.r;
        if (n.y < -n.r) n.y = h + n.r;
        if (n.y > h + n.r) n.y = -n.r;

        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);

        if (theme === "night") {
          gradient.addColorStop(0, "rgba(120, 80, 255, 0.35)");
          gradient.addColorStop(1, "rgba(20, 10, 40, 0)");
        } else {
          gradient.addColorStop(0, "rgba(255, 200, 150, 0.25)");
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
