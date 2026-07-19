import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function MagicalGradient({ theme }) {
  const mesh = useRef();
  const blendRef = useRef(theme === "day" ? 0 : 1);

  // Animate blend value over 8 seconds
  useFrame(() => {
    const target = theme === "day" ? 0 : 1;
    blendRef.current = THREE.MathUtils.lerp(blendRef.current, target, 0.02);

    mesh.current.material.uniforms.blend.value = blendRef.current;
    mesh.current.material.uniforms.time.value += 0.01;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[40, 64, 64]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={{
          time: { value: 0 },
          blend: { value: theme === "day" ? 0 : 1 },

          // DAY colours — bright, magical, colourful
          day1: { value: new THREE.Color("#ffb37a") }, // coral gold
          day2: { value: new THREE.Color("#ff7acb") }, // magical pink
          day3: { value: new THREE.Color("#ffd27f") }, // warm glow

          // NIGHT colours — deep neon magical
          night1: { value: new THREE.Color("#0a0033") }, // deep indigo
          night2: { value: new THREE.Color("#4b00ff") }, // neon violet
          night3: { value: new THREE.Color("#00c8ff") }, // electric blue
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

          uniform vec3 day1;
          uniform vec3 day2;
          uniform vec3 day3;

          uniform vec3 night1;
          uniform vec3 night2;
          uniform vec3 night3;

          varying vec2 vUv;

          void main() {
            float wave = sin(vUv.y * 8.0 + time * 0.5) * 0.5 + 0.5;

            // DAY gradient
            vec3 d = mix(day1, day2, vUv.y);
            d = mix(d, day3, wave);

            // NIGHT gradient
            vec3 n = mix(night1, night2, vUv.y);
            n = mix(n, night3, wave);

            // Magical blend
            vec3 finalColor = mix(d, n, blend);

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function MagicalParticles({ theme }) {
  const ref = useRef();
  const count = 4000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200;
  }

  useFrame(() => {
    ref.current.rotation.y += 0.0004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={theme === "day" ? 0.6 : 0.8}
        color={theme === "day" ? "#ffffff" : "#88ccff"}
        transparent
        opacity={theme === "day" ? 0.7 : 0.9}
      />
    </points>
  );
}

export default function Background3D() {
  const [theme, setTheme] = useState("day");

  // Detect theme toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme");
      if (t) setTheme(t);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="background3d-container">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <MagicalGradient theme={theme} />
        <MagicalParticles theme={theme} />
      </Canvas>
    </div>
  );
}
