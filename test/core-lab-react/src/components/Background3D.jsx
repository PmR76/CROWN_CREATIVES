// ============================================================
// Background3D.jsx — GR1 Living Sky (Interactivity + Magic + Safe)
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
    // NEBULA — Drift + Pulse + Shimmer + Depth
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
        z: Math.random() * 1.5 + 0.5, // ⭐ FIXED: nebula depth
      });
    }

    let pulseTime = 0;

    // ------------------------------------------------------------
    // SAFE GETTERS — Prevent NaN
    // ------------------------------------------------------------
    function safeFloat(value, fallback = 1) {
      const v = parseFloat(value);
      return Number.isFinite(v) ? v : fallback;
    }

    function getCrownGlow() {
      const glow = getComputedStyle(document.body).getPropertyValue("--crown-glow");
      return safeFloat(glow, 1);
    }

    function getSoundLevel() {
      const level = getComputedStyle(document.body).getPropertyValue("--sound-level");
      return safeFloat(level, 0);
    }

    // ------------------------------------------------------------
    // INTERACTIVITY — Mouse Parallax
    // ------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });

    // ------------------------------------------------------------
    // RENDER LOOP
    // ------------------------------------------------------------
    function render() {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      pulseTime += 0.005;

      const themePulse = 1 + Math.sin(pulseTime) * 0.15;
      const crownPulse = getCrownGlow() * 0.2 + 1;
      const soundPulse = getSoundLevel() * 0.3 + 1;

      const combinedPulse = themePulse * crownPulse * soundPulse;

      // ------------------------------------------------------------
      // Draw Nebula (safe + magical)
      // ------------------------------------------------------------
      for (let n of nebula) {
        n.x += n.dx;
        n.y += n.dy;

        const parallaxX = mouseX * n.z * 40;
        const parallaxY = mouseY * n.z * 40;

        const nx = safeFloat(n.x + parallaxX, n.x);
        const ny = safeFloat(n.y + parallaxY, n.y);
        const nr = safeFloat(n.r, 300);

        n.shimmerOffset += 0.002;
        const shimmer = 1 + Math.sin(n.shimmerOffset) * 0.1;

        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);

        if (theme === "night") {
          gradient.addColorStop(0, `rgba(120, 80, 255, ${0.35 * combinedPulse * shimmer})`);
          gradient.addColorStop(1, "rgba(20, 10, 40, 0)");
        } else {
          gradient.addColorStop(0, `rgba(255, 200, 150, ${0.25 * combinedPulse * shimmer})`);
          gradient.addColorStop(1, "rgba(255, 230, 200, 0)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nx, ny, nr, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------------------------
      // Draw Stars (safe + interactive)
      // ------------------------------------------------------------
      for (let s of stars) {
        s.angle += s.speed;

        s.x += Math.cos(s.angle) * s.z;
        s.y += Math.sin(s.angle) * s.z;

        const px = mouseX * s.z * 40;
        const py = mouseY * s.z * 40;

        const sx = safeFloat(s.x + px, s.x);
        const sy = safeFloat(s.y + py, s.y);

        ctx.fillStyle =
          theme === "night"
            ? "rgba(120,200,255,0.9)"
            : "rgba(255,255,255,0.6)";

        ctx.fillRect(sx, sy, 2 * s.z, 2 * s.z);

        ctx.fillStyle =
          theme === "night"
            ? "rgba(120,200,255,0.25)"
            : "rgba(255,255,255,0.15)";

        ctx.fillRect(
          sx - Math.cos(s.angle) * 4,
          sy - Math.sin(s.angle) * 4,
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
