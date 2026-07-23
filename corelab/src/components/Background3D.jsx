// ============================================================
// Background3D.jsx — Cosmic Gradient Background (GR1 Stable)
// ============================================================

import { useEffect } from "react";
import * as THREE from "three";

export default function Background3D() {
  useEffect(() => {
    const container = document.querySelector("#webgl-background");
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera (orthographic for full‑screen shader plane)
    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0, 1
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Full‑screen plane
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Cosmic gradient shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_theme: { value: 0 } // 0 = day, 1 = night
      },
      fragmentShader: `
        precision highp float;

        uniform float u_time;
        uniform float u_theme;

        void main() {
          vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);

          // Day gradient
          vec3 dayTop = vec3(0.4, 0.7, 1.0);
          vec3 dayBottom = vec3(0.9, 0.95, 1.0);

          // Night gradient
          vec3 nightTop = vec3(0.05, 0.05, 0.1);
          vec3 nightBottom = vec3(0.1, 0.1, 0.2);

          vec3 dayColor = mix(dayBottom, dayTop, uv.y);
          vec3 nightColor = mix(nightBottom, nightTop, uv.y);

          vec3 finalColor = mix(dayColor, nightColor, u_theme);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Theme observer
    const updateTheme = () => {
      const theme = document.body.dataset.theme;
      material.uniforms.u_theme.value = theme === "night" ? 1 : 0;
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true });

    // Animation loop
    const animate = () => {
      material.uniforms.u_time.value += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();
      try {
        container.removeChild(renderer.domElement);
      } catch {}
    };
  }, []);

  return null;
}
