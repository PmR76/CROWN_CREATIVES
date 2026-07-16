// ============================================================
// Background3D.jsx — Arcane Aurora Field (GR1 Cinematic)
// ============================================================

import { useEffect } from "react";

export default function Background3D() {
  useEffect(() => {
    const canvas = document.getElementById("aurora-canvas");
    const ctx = canvas.getContext("2d");

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight * 1.2; // extends upward

    const ribbons = Array.from({ length: 4 }).map(() => ({
      y: Math.random() * h,
      speed: 0.15 + Math.random() * 0.25,
      hue: 180 + Math.random() * 80, // blue → purple
      alpha: 0.25 + Math.random() * 0.35
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);

      ribbons.forEach(r => {
        ctx.beginPath();
        ctx.moveTo(0, r.y);

        for (let x = 0; x < w; x += 40) {
          const y = r.y + Math.sin((x + Date.now() * 0.0008) * 0.01) * 80;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `hsla(${r.hue}, 90%, 70%, ${r.alpha})`;
        ctx.lineWidth = 140;
        ctx.stroke();

        r.y -= r.speed;
        if (r.y < -200) r.y = h + 200;
      });

      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight * 1.2;
    });
  }, []);

  return <canvas id="aurora-canvas" className="background-aurora"></canvas>;
}
