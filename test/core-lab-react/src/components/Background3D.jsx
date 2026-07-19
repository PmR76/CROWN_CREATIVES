import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function CosmicGradient({ theme }) {
  const mesh = useRef();

  useFrame(({ clock }) => {
    mesh.current.material.uniforms.time.value = clock.elapsedTime;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[40, 64, 64]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={{
          time: { value: 0 },

          // DAY colours
          dayColor1: { value: new THREE.Color("#ffcf9f") },   // soft gold
          dayColor2: { value: new THREE.Color("#ff8bd1") },   // pink nebula
          dayColor3: { value: new THREE.Color("#ffd27f") },   // warm glow

          // NIGHT colours
          nightColor1: { value: new THREE.Color("#0a0a1a") }, // deep indigo
          nightColor2: { value: new THREE.Color("#1a0033") }, // violet nebula
          nightColor3: { value: new THREE.Color("#330066") }, // cosmic purple

          blend: { value: theme === "day" ? 0 : 1 } // 0 = day, 1 = night
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform float blend;

          uniform vec3 dayColor1;
          uniform vec3 dayColor2;
          uniform vec3 dayColor3;

          uniform vec3 nightColor1;
          uniform vec3 nightColor2;
          uniform vec3 nightColor3;

          varying vec2 vUv;

          void main() {
            float t = sin(time * 0.1) * 0.5 + 0.5;

            // DAY gradient
            vec3 dayGrad = mix(dayColor1, dayColor2, vUv.y);
            dayGrad = mix(dayGrad, dayColor3, t * 0.3);

            // NIGHT gradient
            vec3 nightGrad = mix(nightColor1, nightColor2, vUv.y);
            nightGrad = mix(nightGrad, nightColor3, t * 0.3);

            // Blend based on theme toggle
            vec3 finalColor = mix(dayGrad, nightGrad, blend);

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function ParticleField() {
  const count = 5000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}

export default function Background3D() {
  const [theme, setTheme] = useState("day");

  // Detect theme changes from your toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme");
      if (t) setTheme(t);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none"
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <CosmicGradient theme={theme} />
        <ParticleField />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
