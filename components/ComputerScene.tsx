"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  useProgress,
  Html,
} from "@react-three/drei";
import ComputerModel from "./ComputerModel";


function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="loader">
        <div className="loader-bar">
          <div className="loader-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="loader-text">{progress.toFixed(0)}% загрузка…</p>
      </div>
    </Html>
  );
}

//Scene contents
function SceneContents() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.35}
        scale={5}
        blur={2.5}
      />
      <ComputerModel />
    </>
  );
}

// Main scene component
export default function ComputerScene() {
  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: [0, 0.28, 1.05], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.22, 0);
        }}
      >
        <Suspense fallback={<Loader />}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}
