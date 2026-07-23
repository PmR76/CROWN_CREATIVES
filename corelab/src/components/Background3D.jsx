// ============================================================
// Background3D.jsx — Immersive Particle Field + Magical Gradient
// ============================================================

import { useEffect } from "react";
import * as THREE from "three";
import { GradientShader } from "./Background3DGradient";

export default function Background3D() {
  useEffect(() => {
    const container = document.getElementById("webgl-background");
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer (opaque so gradient is visible)
    const renderer = new THREE.WebGLRenderer({ alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    // ============================================================
    // Magical Gradient Background (full-screen plane)
    // ============================================================
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: GradientShader.uniforms,
      vertexShader: GradientShader.vertexShader,
      fragmentShader: GradientShader.fragmentShader,
      side: THREE.DoubleSide
    });

    // Fullscreen plane in front of camera
    const gradientGeometry = new THREE.PlaneGeometry(20, 20);
    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);

    gradientMesh.position.z = 0; // FIXED — now visible
    scene.add(gradientMesh);

    // ============================================================
    // Particles (unchanged)
    // ============================================================
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

    // ============================================================
    // Theme Listener
    // ============================================================
    const updateTheme = () => {
      const theme = document.body.getAttribute("data-theme");
      gradientMaterial.uniforms.uTheme.value = theme === "night" ? 1 : 0;
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true });

    // ============================================================
    // Animation Loop
    // ============================================================
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      points.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
      try {
        container.removeChild(renderer.domElement);
      } catch {}
      renderer.dispose();
    };
  }, []);

  return null;
}
