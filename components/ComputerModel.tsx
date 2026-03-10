"use client";

import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

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

const CENTER_OFFSET: [number, number, number] = [-1.8, 0, 1.53];
const SCREEN_POS: [number, number, number] = [-0.063, 0.355, 0.085];
const SCREEN_SCALE = 0.0021;

type Props = React.JSX.IntrinsicElements["group"] & {
  onRunClick?: () => void;
  showRunButton?: boolean;
};

export default function ComputerModel({ onRunClick, showRunButton = false, ...props }: Props) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as GLTFResult;

  return (
    <group {...props} rotation={[0, -Math.PI / 2, 0]} dispose={null}>
      <group position={CENTER_OFFSET}>
        <mesh castShadow receiveShadow geometry={nodes.KeyBoard_002005.geometry} material={materials["Ucupaint Keyboard Creme"]} position={[2.035, 0.023, -1.494]} rotation={[Math.PI / 2, 0, 0]} />
        <group position={[1.737, 0.28, -1.524]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh castShadow receiveShadow geometry={nodes.Monitor_002.geometry} material={materials["Monitor Cream"]} />
          <mesh castShadow receiveShadow geometry={nodes.Monitor_002_1.geometry} material={materials.Monitor_Glass} />
        </group>
        <mesh castShadow receiveShadow geometry={nodes.Mouse_001005.geometry} material={materials["Mouse Cream"]} position={[2.019, 0.022, -1.786]} rotation={[Math.PI / 2, 0, 0]} scale={0.011} />
        <group position={[1.754, 0.075, -1.533]} rotation={[Math.PI / 2, 0, 0]} scale={0.011}>
          <mesh castShadow receiveShadow geometry={nodes.PC_004.geometry} material={materials["PC Cream"]} />
          <mesh castShadow receiveShadow geometry={nodes.PC_004_1.geometry} material={materials["Pc Feet"]} />
        </group>
        <mesh castShadow receiveShadow geometry={nodes.NurbsPath014.geometry} material={materials["Pc Feet"]} position={[2, 0.011, -1.333]} rotation={[0, 0, -Math.PI]} scale={-0.102} />
        <mesh castShadow receiveShadow geometry={nodes.NurbsPath016.geometry} material={materials["Pc Feet"]} position={[2, 0.011, -1.783]} scale={0.102} />
        <mesh castShadow receiveShadow geometry={nodes.NurbsPath020.geometry} material={materials["Pc Feet"]} position={[1.488, 0.134, -1.475]} rotation={[0, 0, -Math.PI]} scale={-0.102} />
        <mesh castShadow receiveShadow geometry={nodes.NurbsPath021.geometry} material={materials["Pc Feet"]} position={[1.49, 0.13, -1.542]} rotation={[0, 0, -Math.PI]} scale={-0.102} />
        <mesh castShadow receiveShadow geometry={nodes.PC_004005.geometry} material={materials["PC_Front Cream"]} position={[1.754, 0.075, -1.533]} rotation={[Math.PI / 2, 0, 0]} scale={0.011} />
      </group>

      <group position={SCREEN_POS}>
        <Html transform scale={SCREEN_SCALE} distanceFactor={1.5} zIndexRange={[1, 0]} className="screen-html-root">
          <div className="screen-wrapper fade-in">
            <div className="screen-container screen-off">
              <div className="screen-off-glow" />
              <p className="screen-off-hint">no signal</p>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
