// ============================================================
// Background3D.jsx — Immersive Particle Field (Theme Reactive)
// ============================================================

import { useEffect } from "react";
import * as THREE from "three";

export default function Background3D() {
  useEffect(() => {
    const container = document.getElementById("webgl-background");
    if (!container) return;

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

    const applyTheme = (theme) => {
      let targetColor;
      let targetOpacity;

      if (theme === "night") {
        targetColor = new THREE.Color(0x66ccff);
        targetOpacity = 0.35;
      } else if (theme === "day") {
        targetColor = new THREE.Color(0xffffff);
        targetOpacity = 0.5;
      } else {
        targetColor = new THREE.Color(0xffcc66);
        targetOpacity = 0.45;
      }

      const duration = 8000;
      const start = performance.now();

      const initialColor = material.color.clone();
      const initialOpacity = material.opacity;

      const animateTween = (time) => {
        const t = Math.min((time - start) / duration, 1);

        material.color.r = initialColor.r + (targetColor.r - initialColor.r) * t;
        material.color.g = initialColor.g + (targetColor.g - initialColor.g) * t;
        material.color.b = initialColor.b + (targetColor.b - initialColor.b) * t;

        material.opacity =
          initialOpacity + (targetOpacity - initialOpacity) * t;

        if (t < 1) requestAnimationFrame(animateTween);
      };

      requestAnimationFrame(animateTween);
    };

    applyTheme(document.body.dataset.theme || "day");

    const handleThemeSet = (e) => applyTheme(e.detail);
    window.addEventListener("theme-set", handleThemeSet);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("theme-set", handleThemeSet);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div id="webgl-background"></div>;
}
