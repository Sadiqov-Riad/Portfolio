"use client";

import { useGLTF } from "@react-three/drei";

const CUP_PATH = "/models/source/coffee_cup.glb";

const CUP_POSITION: [number, number, number] = [0.38, 0.04, 0.2];
const CUP_ROTATION: [number, number, number] = [0, -0.45, 0];
const CUP_SCALE = 0.06;

export default function CoffeeCupModel() {
  const { scene } = useGLTF(CUP_PATH);
  return (
    <group position={CUP_POSITION} rotation={CUP_ROTATION}>
      <primitive
        object={scene}
        scale={CUP_SCALE}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload(CUP_PATH);
