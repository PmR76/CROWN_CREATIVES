// ============================================================
// Background3D.jsx — GR1 Cinematic Transparent Swirling Starfield
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

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ------------------------------------------------------------
    // PARTICLES — Swirl + Depth + Trails
    // ------------------------------------------------------------
    const particles = [];
    const count = 350;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1.8 + 0.3, // depth
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.003 + 0.001,
      });
    }

    // ------------------------------------------------------------
    // RENDER LOOP — Transparent Canvas
    // ------------------------------------------------------------
    function render() {
      const w = canvas.width;
      const h = canvas.height;

      // Clear with transparency (NO background fill)
      ctx.clearRect(0, 0, w, h);

      for (let p of particles) {
        // Swirl motion
        p.angle += p.speed;
        p.x += Math.cos(p.angle) * p.z;
        p.y += Math.sin(p.angle) * p.z;

        // Wrap edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Particle color
        ctx.fillStyle =
          theme === "night"
            ? "rgba(120,200,255,0.9)"   // neon blue
            : "rgba(255,255,255,0.6)";  // soft day white

        // Draw particle
        ctx.fillRect(p.x, p.y, 2 * p.z, 2 * p.z);

        // Trails (motion blur)
        ctx.fillStyle =
          theme === "night"
            ? "rgba(120,200,255,0.25)"
            : "rgba(255,255,255,0.15)";

        ctx.fillRect(p.x - Math.cos(p.angle) * 4, p.y - Math.sin(p.angle) * 4, 2 * p.z, 2 * p.z);
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
