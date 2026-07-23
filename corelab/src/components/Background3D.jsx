// ============================================================
// Background3D.jsx — Stable Cosmic Background (GR1)
// ============================================================

import { useEffect } from "react";
import * as THREE from "three";
import { GradientShader } from "./Background3DGradient";

export default function Background3D() {
  useEffect(() => {
    const container = document.querySelector("#webgl-background");
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.OrthographicCamera(
      -10, 10,
      10, -10,
      0.1,
      100
    );
    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    // ============================================================
    // Magical Gradient Background (fullscreen plane)
    // ============================================================
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTheme: { value: 0 }
      },
      vertexShader: GradientShader.vertexShader,
      fragmentShader: GradientShader.fragmentShader,
      side: THREE.DoubleSide
    });

    const gradientGeometry = new THREE.PlaneGeometry(20, 20);
    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.z = -1;

    scene.add(gradientMesh);

    // ============================================================
    // Particle Field
    // ============================================================
    const particles = new THREE.BufferGeometry();
    const count = 1200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.6
    });

    const points = new THREE.Points(particles, particleMaterial);
    scene.add(points);

    // ============================================================
    // Theme Listener
    // ============================================================
    const updateTheme = () => {
      const theme =
        document.body.dataset.theme ||
        document.documentElement.dataset.theme ||
        "day";

      gradientMaterial.uniforms.uTheme.value = theme === "night" ? 1 : 0;
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true });
    observer.observe(document.documentElement, { attributes: true });

    // ============================================================
    // Animation Loop
    // ============================================================
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      points.rotation.y += 0.0006;
      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
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
