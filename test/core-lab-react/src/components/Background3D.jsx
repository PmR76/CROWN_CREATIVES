// ============================================================
// Background3D.jsx — Immersive Particle Field (Theme Reactive)
// ============================================================

import { useEffect } from "react";
import * as THREE from "three";

export default function Background3D() {
  useEffect(() => {
    const container = document.getElementById("webgl-background");
    if (!container) return;

    // ------------------------------------------------------------
    // SCENE SETUP
    // ------------------------------------------------------------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    // ------------------------------------------------------------
    // PARTICLE FIELD
    // ------------------------------------------------------------
    const particles = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.5
    });

    const points = new THREE.Points(particles, material);
    scene.add(points);

    // ------------------------------------------------------------
    // THEME REACTIVITY — LISTEN FOR theme-set
    // ------------------------------------------------------------
    const applyTheme = (theme) => {
      if (theme === "night") {
        material.color.set(0x66ccff); // neon blue
        material.opacity = 0.35;
      } else if (theme === "day") {
        material.color.set(0xffffff); // bright white
        material.opacity = 0.5;
      } else {
        // admin / custom themes
        material.color.set(0xffcc66); // gold
        material.opacity = 0.45;
      }
    };

    // Apply initial theme
    applyTheme(document.body.dataset.theme || "day");

    // Listen for theme changes
    const handleThemeSet = (event) => {
      const theme = event.detail;
      applyTheme(theme);
    };

    window.addEventListener("theme-set", handleThemeSet);

    // ------------------------------------------------------------
    // ANIMATION LOOP
    // ------------------------------------------------------------
    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };

    animate();

    // ------------------------------------------------------------
    // RESIZE HANDLER
    // ------------------------------------------------------------
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // ------------------------------------------------------------
    // CLEANUP
    // ------------------------------------------------------------
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("theme-set", handleThemeSet);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div id="webgl-background"></div>;
}
