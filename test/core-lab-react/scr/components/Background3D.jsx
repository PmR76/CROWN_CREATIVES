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
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return null;
}
