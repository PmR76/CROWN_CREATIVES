import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

export default function Background3D() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1
      }}
    >
      <Canvas>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Replace with your nebula model */}
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        <OrbitControls enableZoom={false} enablePan={false} />

        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
