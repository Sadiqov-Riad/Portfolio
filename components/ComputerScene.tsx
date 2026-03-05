"use client";

import { Suspense, useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, SpotLight } from "@react-three/drei";
import * as THREE from "three";
import CoffeeCupModel from "./CoffeeCupModel";
import ComputerModel from "./ComputerModel";
import DeskModel from "./DeskModel";
import LinuxOS from "./LinuxOS";

const LIGHT_DURATION = 1.8;
const ZOOM_DURATION = 0.7;
const FADE_DURATION = 0.5;

const CAM_START: [number, number, number] = [0, 0.3, 1.25];
const CAM_END: [number, number, number] = [0, 0.43, 0.865];
const LOOK_AT: [number, number, number] = [0, 0.3, 0];

function CameraZoom({ zooming, idle, onComplete }: { zooming: boolean; idle: boolean; onComplete: () => void }) {
  const { camera } = useThree();
  const tRef = useRef(0);
  const completedRef = useRef(false);

  useFrame((_, delta) => {
    if (idle) {
      camera.position.set(...CAM_START);
      camera.lookAt(...LOOK_AT);
      camera.updateProjectionMatrix();
      completedRef.current = false;
      tRef.current = 0;
      return;
    }
    if (!zooming) {
      completedRef.current = false;
      tRef.current = 0;
      return;
    }
    if (completedRef.current) return;

    tRef.current = Math.min(tRef.current + delta / ZOOM_DURATION, 1);
    const ease = 1 - (1 - tRef.current) ** 2;

    camera.position.lerpVectors(
      new THREE.Vector3(...CAM_START),
      new THREE.Vector3(...CAM_END),
      ease
    );
    camera.lookAt(...LOOK_AT);
    camera.updateProjectionMatrix();

    if (tRef.current >= 1) {
      completedRef.current = true;
      onComplete();
    }
  });

  return null;
}

function SceneContents({
  loaderDone,
  zooming,
  idle,
  onZoomComplete,
}: {
  loaderDone: boolean;
  zooming: boolean;
  idle: boolean;
  onZoomComplete: () => void;
}) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const point1Ref = useRef<THREE.PointLight>(null);
  const point2Ref = useRef<THREE.PointLight>(null);
  const startedRef = useRef(false);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!loaderDone) return;
    if (!startedRef.current) {
      startedRef.current = true;
      tRef.current = 0;
    }
    tRef.current = Math.min(tRef.current + delta / LIGHT_DURATION, 1);
    const ease = 1 - (1 - tRef.current) ** 2;

    if (ambientRef.current) ambientRef.current.intensity = 0.08 * ease;
    if (dirRef.current) dirRef.current.intensity = 0.35 * ease;
    if (spotRef.current) spotRef.current.intensity = 6 * ease;
    if (point1Ref.current) point1Ref.current.intensity = 0.4 * ease;
    if (point2Ref.current) point2Ref.current.intensity = 0.5 * ease;
  });

  return (
    <>
      <CameraZoom zooming={zooming} idle={idle} onComplete={onZoomComplete} />
      <ambientLight ref={ambientRef} intensity={0} color="#c8d4e8" />
      <directionalLight ref={dirRef} position={[2, 4, 3]} intensity={0} color="#c8d4e8" />
      <SpotLight
        ref={spotRef}
        position={[1.2, 1.5, 0.8]}
        target-position={[0, 0.1, 0]}
        intensity={0}
        angle={0.45}
        penumbra={0.7}
        color="#ffe8c0"
        castShadow
        distance={4}
        attenuation={3}
        anglePower={4}
      />
      <pointLight ref={point1Ref} position={[-1, 0.6, -0.8]} intensity={0} color="#4466aa" distance={3} />
      <pointLight ref={point2Ref} position={[0, 1.2, 0.3]} intensity={0} color="#fff8c0" distance={2} />
      <Environment preset="night" environmentIntensity={0.15} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={4} blur={3} color="#000000" />
      <DeskModel />
      <ComputerModel />
      <CoffeeCupModel />
    </>
  );
}

type ComputerSceneProps = {
  loaderDone?: boolean;
};

export default function ComputerScene({ loaderDone = false }: ComputerSceneProps) {
  const [phase, setPhase] = useState<"idle" | "zooming" | "fadeout" | "linux">("idle");

  const handleZoomComplete = useCallback(() => {
    setPhase("fadeout");
  }, []);

  const handleFadeComplete = useCallback(() => {
    setPhase("linux");
  }, []);

  return (
    <div className="scene-container" style={{ background: "#0e0e0f" }}>
      <Canvas
        camera={{ position: [...CAM_START], fov: 42 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        dpr={[1, 2]}
        onCreated={({ scene, camera }) => {
          scene.background = new THREE.Color("#0e0e0f");
          scene.fog = new THREE.FogExp2("#0e0e0f", 0.35);
          camera.lookAt(...LOOK_AT);
        }}
      >
        <Suspense fallback={null}>
          <SceneContents
            loaderDone={loaderDone}
            zooming={phase === "zooming"}
            idle={phase === "idle"}
            onZoomComplete={handleZoomComplete}
          />
        </Suspense>
      </Canvas>

      {/* Fade to black before Linux OS */}
      {phase === "fadeout" && (
        <div
          className="fadeout-overlay"
          style={{
            animation: `fadeout-overlay-fade ${FADE_DURATION}s ease forwards`,
          }}
          onAnimationEnd={handleFadeComplete}
        />
      )}

      {/* 2D overlay button — hidden during zoom */}
      {phase === "idle" && (
        <div className="run-btn-overlay">
          <button className="run-btn-2d" onClick={() => setPhase("zooming")}>
            <span className="run-btn-2d-icon">⏻</span>
            Click to Run
          </button>
        </div>
      )}

      {/* Fullscreen Linux OS overlay — only after zoom completes */}
      {phase === "linux" && <LinuxOS onClose={() => setPhase("idle")} />}
    </div>
  );
}
