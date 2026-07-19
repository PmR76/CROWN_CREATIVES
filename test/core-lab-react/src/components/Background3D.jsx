import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CosmicGradient() {
  const mesh = useRef();

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[40, 64, 64]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={{
          color1: { value: new THREE.Color("#0a0a1a") },
          color2: { value: new THREE.Color("#1a0033") },
          color3: { value: new THREE.Color("#330066") },
          time: { value: 0 }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform float time;
          varying vec2 vUv;

          void main() {
            float t = sin(time * 0.1) * 0.5 + 0.5;
            vec3 gradient = mix(color1, color2, vUv.y);
            gradient = mix(gradient, color3, t * 0.3);
            gl_FragColor = vec4(gradient, 1.0);
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
        size={0.5}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

export default function Background3D() {
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
        {/* Cosmic gradient background */}
        <CosmicGradient />

        {/* Particle field */}
        <ParticleField />

        {/* Stars for extra depth */}
        <Stars radius={100} depth={50} count={3000} factor={4} fade />

        {/* Camera controls (disabled interaction) */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
