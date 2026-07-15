// ============================================================
// Background3D.jsx — GR1 Crown Aura + Orbit Particles + Living Sky
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
    // SAFE FLOAT
    // ------------------------------------------------------------
    function safeFloat(value, fallback = 1) {
      const v = parseFloat(value);
      return Number.isFinite(v) ? v : fallback;
    }

    // ------------------------------------------------------------
    // CROWN SYNC — Glow + Position
    // ------------------------------------------------------------
    function getCrownGlow() {
      return safeFloat(
        getComputedStyle(document.body).getPropertyValue("--crown-glow"),
        1
      );
    }

    function getCrownPosition() {
      const el = document.querySelector(".reduced-crown");
      if (!el) return { x: window.innerWidth / 2, y: 200 };

      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    // ------------------------------------------------------------
    // CROWN AURA — Ripple + Shimmer
    // ------------------------------------------------------------
    let auraRipple = 0;
    let auraShimmer = 0;

    window.addEventListener("click", () => {
      auraRipple = 1; // click burst
      orbitParticles.forEach((p) => (p.scatter = 1)); // scatter orbit particles
    });

    // ------------------------------------------------------------
    // SOUND SYNC
    // ------------------------------------------------------------
    function getSoundLevel() {
      return safeFloat(
        getComputedStyle(document.body).getPropertyValue("--sound-level"),
        0
      );
    }

    // ------------------------------------------------------------
    // MOUSE PARALLAX
    // ------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });

    // ------------------------------------------------------------
    // STARFIELD
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
        burst: 0,
      });
    }

    // ------------------------------------------------------------
    // NEBULA
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
        z: Math.random() * 1.5 + 0.5,
        attract: 0,
      });
    }

    // ------------------------------------------------------------
    // ORBIT PARTICLES — Magical Crown Halo
    // ------------------------------------------------------------
    const orbitParticles = [];
    const orbitCount = 40;

    for (let i = 0; i < orbitCount; i++) {
      orbitParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 60 + 40,
        speed: Math.random() * 0.02 + 0.01,
        scatter: 0,
        shimmer: Math.random() * Math.PI * 2,
      });
    }

    let pulseTime = 0;

    // ------------------------------------------------------------
    // RENDER LOOP
    // ------------------------------------------------------------
    function render() {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      pulseTime += 0.005;

      const themePulse = 1 + Math.sin(pulseTime) * 0.15;
      const crownPulse = getCrownGlow() * 0.3 + 1;
      const soundPulse = getSoundLevel() * 0.3 + 1;

      const combinedPulse = themePulse * crownPulse * soundPulse;

      const crownPos = getCrownPosition();

      // ------------------------------------------------------------
      // Crown Aura — Ripple + Shimmer + Pulse
      // ------------------------------------------------------------
      auraRipple *= 0.94;
      auraShimmer += 0.01;

      const auraRadius =
        180 * crownPulse +
        auraRipple * 200 +
        Math.sin(auraShimmer) * 20;

      const auraGradient = ctx.createRadialGradient(
        crownPos.x,
        crownPos.y,
        0,
        crownPos.x,
        crownPos.y,
        auraRadius
      );

      if (theme === "night") {
        auraGradient.addColorStop(0, `rgba(120, 80, 255, ${0.45 * crownPulse})`);
        auraGradient.addColorStop(0.5, `rgba(80, 40, 200, ${0.25 * crownPulse})`);
        auraGradient.addColorStop(1, "rgba(20, 10, 40, 0)");
      } else {
        auraGradient.addColorStop(0, `rgba(255, 200, 150, ${0.35 * crownPulse})`);
        auraGradient.addColorStop(0.5, `rgba(255, 160, 120, ${0.2 * crownPulse})`);
        auraGradient.addColorStop(1, "rgba(255, 230, 200, 0)");
      }

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(crownPos.x, crownPos.y, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // ------------------------------------------------------------
      // Orbit Particles — Crown Halo
      // ------------------------------------------------------------
      for (let p of orbitParticles) {
        p.angle += p.speed * crownPulse;

        p.shimmer += 0.05;

        // Scatter decay
        p.scatter *= 0.92;

        const scatterX = Math.cos(p.angle) * p.scatter * 40;
        const scatterY = Math.sin(p.angle) * p.scatter * 40;

        const x =
          crownPos.x +
          Math.cos(p.angle) * p.radius +
          scatterX +
          mouseX * 10;

        const y =
          crownPos.y +
          Math.sin(p.angle) * p.radius +
          scatterY +
          mouseY * 10;

        const glow = 0.6 + Math.sin(p.shimmer) * 0.4;

        ctx.fillStyle =
          theme === "night"
            ? `rgba(120,200,255,${glow})`
            : `rgba(255,200,150,${glow})`;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------------------------
      // Nebula (with aura attraction)
      // ------------------------------------------------------------
      for (let n of nebula) {
        n.x += n.dx;
        n.y += n.dy;

        const dx = crownPos.x - n.x;
        const dy = crownPos.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        n.attract = Math.max(0, 1 - dist / 1400);

        const parallaxX = mouseX * n.z * 40 + dx * n.attract * 0.03;
        const parallaxY = mouseY * n.z * 40 + dy * n.attract * 0.03;

        const nx = safeFloat(n.x + parallaxX, n.x);
        const ny = safeFloat(n.y + parallaxY, n.y);
        const nr = safeFloat(n.r + auraRipple * 150, n.r);

        n.shimmerOffset += 0.002;
        const shimmer = 1 + Math.sin(n.shimmerOffset) * 0.1;

        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);

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
        ctx.arc(nx, ny, nr, 0, Math.PI * 2);
        ctx.fill();
      }

      // ------------------------------------------------------------
      // Stars (with aura burst + color shift)
      // ------------------------------------------------------------
      for (let s of stars) {
        s.angle += s.speed;

        s.x += Math.cos(s.angle) * s.z;
        s.y += Math.sin(s.angle) * s.z;

        const px = mouseX * s.z * 40;
        const py = mouseY * s.z * 40;

        const sx = safeFloat(s.x + px, s.x);
        const sy = safeFloat(s.y + py, s.y);

        const dx = crownPos.x - sx;
        const dy = crownPos.y - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        s.burst = Math.max(0, 1 - dist / 900);

        const burstGlow = s.burst * 0.8;

        ctx.fillStyle =
          theme === "night"
            ? `rgba(120,200,255,${0.9 + burstGlow})`
            : `rgba(255,255,255,${0.6 + burstGlow})`;

        ctx.fillRect(sx, sy, 2 * s.z, 2 * s.z);

        ctx.fillStyle =
          theme === "night"
            ? `rgba(120,200,255,${0.25 + burstGlow})`
            : `rgba(255,255,255,${0.15 + burstGlow})`;

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
