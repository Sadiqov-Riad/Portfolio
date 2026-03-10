"use client";

import { Suspense, useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, SpotLight, Html } from "@react-three/drei";
import * as THREE from "three";
import CoffeeCupModel from "./CoffeeCupModel";
import ComputerModel from "./ComputerModel";
import DeskModel from "./DeskModel";
import RetroWindows from "./RetroWindows";

const LIGHT_DURATION = 1.8;
const ZOOM_DURATION = 0.6;

const CAM_STAGES: [number, number, number][] = [
  [0, 0.3, 1.25],    // Far view
  [0, 0.43, 0.865],  // Mid view
  [0, 0.45, 0.55],   // Screen view
];
const LOOK_AT_START: [number, number, number] = [0, 0.3, 0];
const LOOK_AT_END: [number, number, number] = [0, 0.38, 0];

function CameraZoom({ zooming, idle, onComplete, onPreComplete }: { zooming: boolean; idle: boolean; onComplete: () => void; onPreComplete: () => void }) {
  const { camera } = useThree();
  const tRef = useRef(0);
  const completedRef = useRef(false);
  const preCompletedRef = useRef(false);
  const startPosRef = useRef<THREE.Vector3 | null>(null);
  const lookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(...LOOK_AT_START));

  useFrame((state, delta) => {
    if (idle) {
      const { pointer } = state;
      // Parallax
      const targetX = CAM_STAGES[0][0] + pointer.x * 0.08;
      const targetY = CAM_STAGES[0][1] + pointer.y * 0.08;
      const targetZ = CAM_STAGES[0][2];

      camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 3 * delta);
      
      // Smooth lookAt back to start
      lookAtRef.current.lerp(new THREE.Vector3(...LOOK_AT_START), 3 * delta);
      camera.lookAt(lookAtRef.current);
      
      camera.updateProjectionMatrix();

      completedRef.current = false;
      preCompletedRef.current = false;
      tRef.current = 0;
      startPosRef.current = null;
      return;
    }
    if (!zooming && tRef.current === 0) {
      completedRef.current = false;
      preCompletedRef.current = false;
      tRef.current = 0;
      startPosRef.current = null;
      return;
    }
    if (completedRef.current) return;
    
    if (!startPosRef.current) {
      startPosRef.current = camera.position.clone();
    }

    tRef.current = Math.min(tRef.current + delta / ZOOM_DURATION, 1);
    
    const ease = 1 - (1 - tRef.current) ** 2;

    const pos = new THREE.Vector3();
    const v0 = startPosRef.current;
    const v1 = new THREE.Vector3(...CAM_STAGES[1]);
    const v2 = new THREE.Vector3(...CAM_STAGES[2]);

    if (ease < 0.5) {
      const localEase = ease * 2;
      pos.lerpVectors(v0, v1, localEase);
    } else {
      const localEase = (ease - 0.5) * 2;
      pos.lerpVectors(v1, v2, localEase);
    }

    camera.position.copy(pos);
  
    const currentLookAt = new THREE.Vector3();
    currentLookAt.lerpVectors(
      new THREE.Vector3(...LOOK_AT_START),
      new THREE.Vector3(...LOOK_AT_END),
      ease
    );
    lookAtRef.current.copy(currentLookAt);
    camera.lookAt(lookAtRef.current);
    
    camera.updateProjectionMatrix();

    if (tRef.current >= 0.95 && !preCompletedRef.current) {
      preCompletedRef.current = true;
      onPreComplete();
    }

    if (tRef.current >= 1 && !completedRef.current) {
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
  onPreComplete,
  setPhase,
  phase,
  showLinux,
}: {
  loaderDone: boolean;
  zooming: boolean;
  idle: boolean;
  onZoomComplete: () => void;
  onPreComplete: () => void;
  setPhase: (phase: "idle" | "zooming" | "linux") => void;
  phase: "idle" | "zooming" | "linux";
  showLinux: boolean;
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
      <CameraZoom zooming={zooming} idle={idle} onComplete={onZoomComplete} onPreComplete={onPreComplete} />
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
      
      {phase === "idle" && !showLinux && loaderDone && (
        <Html position={[0, 0.38, 0.08]} center zIndexRange={[100, 0]}>
          <button className="run-btn-2d" onClick={() => setPhase("zooming")}>
            <span className="run-btn-2d-icon">⏻</span> CLICK TO RUN
          </button>
        </Html>
      )}
    </>
  );
}

type ComputerSceneProps = {
  loaderDone?: boolean;
};

export default function ComputerScene({ loaderDone = false }: ComputerSceneProps) {
  const [phase, setPhase] = useState<"idle" | "zooming" | "linux">("idle");
  const [showLinux, setShowLinux] = useState(false);

  const handlePreComplete = useCallback(() => {
    setShowLinux(true);
  }, []);

  const handleZoomComplete = useCallback(() => {
    setPhase("linux");
  }, []);

  return (
    <div className="scene-container" style={{ background: "#0e0e0f" }}>
      <Canvas
        camera={{ position: [...CAM_STAGES[0]], fov: 42 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        dpr={[1, 2]}
        onCreated={({ scene, camera }) => {
          scene.background = new THREE.Color("#0e0e0f");
          scene.fog = new THREE.FogExp2("#0e0e0f", 0.35);
          camera.lookAt(...LOOK_AT_START);
        }}
      >
        <Suspense fallback={null}>
          <SceneContents
            loaderDone={loaderDone}
            zooming={phase === "zooming"}
            idle={phase === "idle"}
            onZoomComplete={handleZoomComplete}
            onPreComplete={handlePreComplete}
            setPhase={setPhase}
            phase={phase}
            showLinux={showLinux}
          />
        </Suspense>
      </Canvas>

      {showLinux && (
        <RetroWindows
          onClose={() => {
            setShowLinux(false);
            setPhase("idle");
          }}
        />
      )}
    </div>
  );
}
