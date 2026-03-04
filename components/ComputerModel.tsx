"use client";

import { useState, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import { Monitor, Terminal, Folder, Globe, Power } from "lucide-react";


type GLTFResult = GLTF & {
  nodes: {
    ["KeyBoard_002005"]: THREE.Mesh;
    ["Monitor_002"]: THREE.Mesh;
    ["Monitor_002_1"]: THREE.Mesh;
    ["Mouse_001005"]: THREE.Mesh;
    ["PC_004"]: THREE.Mesh;
    ["PC_004_1"]: THREE.Mesh;
    ["NurbsPath014"]: THREE.Mesh;
    ["NurbsPath016"]: THREE.Mesh;
    ["NurbsPath020"]: THREE.Mesh;
    ["NurbsPath021"]: THREE.Mesh;
    ["PC_004005"]: THREE.Mesh;
  };
  materials: {
    ["Ucupaint Keyboard Creme"]: THREE.MeshStandardMaterial;
    ["Monitor Cream"]: THREE.MeshStandardMaterial;
    ["Monitor_Glass"]: THREE.MeshStandardMaterial;
    ["Mouse Cream"]: THREE.MeshStandardMaterial;
    ["PC Cream"]: THREE.MeshStandardMaterial;
    ["Pc Feet"]: THREE.MeshStandardMaterial;
    ["PC_Front Cream"]: THREE.MeshStandardMaterial;
  };
};

const MODEL_PATH = "/models/source/Retro Pc.glb";

/* ─────────────────── Splash Screen (before START) ─────────────────── */

function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen-container splash">
      <div className="splash-logo">
        <Monitor size={48} strokeWidth={1.5} />
      </div>
      <h1 className="splash-title">Portfolio OS</h1>
      <p className="splash-sub">v1.0 — Interactive Experience</p>
      <button className="start-btn" onClick={onStart}>
        <Power size={16} />
        СТАРТ
      </button>
    </div>
  );
}

//Desktop screen 

function DesktopScreen() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="screen-container desktop">
      {/* taskbar */}
      <div className="taskbar">
        <span className="taskbar-title">Portfolio OS</span>
        <span className="taskbar-clock">{time}</span>
      </div>

      {/* icons */}
      <div className="desktop-icons">
        <DesktopIcon icon={<Folder size={28} />} label="Проекты" />
        <DesktopIcon icon={<Terminal size={28} />} label="Терминал" />
        <DesktopIcon icon={<Globe size={28} />} label="Браузер" />
      </div>

      {/* terminal-style window */}
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-label">terminal</span>
        </div>
        <div className="terminal-body">
          <p>
            <span className="prompt">$</span> whoami
          </p>
          <p className="output">senior-frontend-developer</p>
          <p>
            <span className="prompt">$</span> cat skills.txt
          </p>
          <p className="output">React · Next.js · Three.js · TypeScript</p>
          <p>
            <span className="prompt">$</span> echo &quot;Добро
            пожаловать!&quot;
          </p>
          <p className="output blink-cursor">Добро пожаловать! █</p>
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="desktop-icon-btn">
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Model comonent 

export default function ComputerModel(
  props: React.JSX.IntrinsicElements["group"]
) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as GLTFResult;

  const [started, setStarted] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const handleStart = () => {
    setFadeIn(true);
    setTimeout(() => {
      setStarted(true);
      setFadeIn(false);
    }, 400);
  };

  /*
   * 🔍 DEBUG — раскомментируйте, чтобы узнать world-позиции мешей:
   *
   * useEffect(() => {
   *   groupRef.current?.traverse((child) => {
   *     if ((child as THREE.Mesh).isMesh) {
   *       const wp = new THREE.Vector3();
   *       child.getWorldPosition(wp);
   *       console.log(child.name, "world:", wp);
   *     }
   *   });
   * }, []);
   */

  /*
   * Центрируем всю модель: оригинальные координаты компьютера
   * смещены примерно на [1.8, 0, -1.53], поэтому сдвигаем обратно.
   *
   * screenPosition подобрана так, чтобы Html совпал с Monitor_Glass.
   * Если экран смещён — подкрутите значения ниже ↓
   */

  const CENTER_OFFSET: [number, number, number] = [-1.8, 0, 1.53];

  /*
   * Позиция HTML-экрана (в координатах centered-модели).
   * Monitor group original position: [1.737, 0.28, -1.524]
   * After centering: [-0.063, 0.28, 0.006]
   * Screen face is ~0.07 forward (+Z after centering) from monitor pivot.
   */
  const SCREEN_POS: [number, number, number] = [-0.063, 0.355, 0.085];
  const SCREEN_SCALE = 0.0021;

  return (
    <group {...props} rotation={[0, -Math.PI / 2, 0]} dispose={null}>
      <group position={CENTER_OFFSET}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.KeyBoard_002005.geometry}
          material={materials["Ucupaint Keyboard Creme"]}
          position={[2.035, 0.023, -1.494]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <group
          position={[1.737, 0.28, -1.524]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Monitor_002.geometry}
            material={materials["Monitor Cream"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Monitor_002_1.geometry}
            material={materials.Monitor_Glass}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mouse_001005.geometry}
          material={materials["Mouse Cream"]}
          position={[2.019, 0.022, -1.786]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.011}
        />

        <group
          position={[1.754, 0.075, -1.533]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.011}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.PC_004.geometry}
            material={materials["PC Cream"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.PC_004_1.geometry}
            material={materials["Pc Feet"]}
          />
        </group>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.NurbsPath014.geometry}
          material={materials["Pc Feet"]}
          position={[2, 0.011, -1.333]}
          rotation={[0, 0, -Math.PI]}
          scale={-0.102}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.NurbsPath016.geometry}
          material={materials["Pc Feet"]}
          position={[2, 0.011, -1.783]}
          scale={0.102}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.NurbsPath020.geometry}
          material={materials["Pc Feet"]}
          position={[1.488, 0.134, -1.475]}
          rotation={[0, 0, -Math.PI]}
          scale={-0.102}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.NurbsPath021.geometry}
          material={materials["Pc Feet"]}
          position={[1.49, 0.13, -1.542]}
          rotation={[0, 0, -Math.PI]}
          scale={-0.102}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.PC_004005.geometry}
          material={materials["PC_Front Cream"]}
          position={[1.754, 0.075, -1.533]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.011}
        />
      </group>

      <group position={SCREEN_POS}>
        <Html
          transform
          scale={SCREEN_SCALE}
          distanceFactor={1.5}
          zIndexRange={[1, 0]}
          className="screen-html-root"
        >
          <div className={`screen-wrapper ${fadeIn ? "fade-out" : "fade-in"}`}>
            {started ? (
              <DesktopScreen />
            ) : (
              <SplashScreen onStart={handleStart} />
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}


useGLTF.preload(MODEL_PATH);
