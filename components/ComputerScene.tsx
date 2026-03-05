"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, SpotLight } from "@react-three/drei";
import * as THREE from "three";
import ComputerModel from "./ComputerModel";
import DeskModel from "./DeskModel";
import LinuxOS from "./LinuxOS";

function SceneContents() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[2, 4, 3]} intensity={0.25} color="#c8d4e8" />
      <SpotLight
        position={[1.2, 1.5, 0.8]}
        target-position={[0, 0.1, 0]}
        intensity={4}
        angle={0.45}
        penumbra={0.7}
        color="#ffe8c0"
        castShadow
        distance={4}
        attenuation={3}
        anglePower={4}
      />
      <pointLight position={[-1, 0.6, -0.8]} intensity={0.4} color="#4466aa" distance={3} />
      <pointLight position={[0, 1.2, 0.3]} intensity={0.3} color="#fff8c0" distance={2} />
      <Environment preset="night" environmentIntensity={0.15} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={4} blur={3} color="#000000" />
      <DeskModel />
      <ComputerModel />
    </>
  );
}

export default function ComputerScene() {
  const [linuxOpen, setLinuxOpen] = useState(false);

  return (
    <div className="scene-container" style={{ background: "#0e0e0f" }}>
      <Canvas
        camera={{ position: [0, 0.28, 1.05], fov: 42 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        dpr={[1, 2]}
        onCreated={({ scene, camera }) => {
          scene.background = new THREE.Color("#0e0e0f");
          scene.fog = new THREE.FogExp2("#0e0e0f", 0.35);
          camera.lookAt(0, 0.22, 0);
        }}
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>

      {/* 2D overlay button near the monitor */}
      {!linuxOpen && (
        <div className="run-btn-overlay">
          <button className="run-btn-2d" onClick={() => setLinuxOpen(true)}>
            <span className="run-btn-2d-icon">⏻</span>
            Click to Run
          </button>
        </div>
      )}

      {/* Fullscreen Linux OS overlay */}
      {linuxOpen && <LinuxOS onClose={() => setLinuxOpen(false)} />}
    </div>
  );
}
