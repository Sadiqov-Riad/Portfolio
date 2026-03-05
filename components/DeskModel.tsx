"use client";

import { useGLTF } from "@react-three/drei";

const DESK_PATH = "/models/source/computer_desk.glb";

export default function DeskModel() {
  const { scene } = useGLTF(DESK_PATH);
  return <primitive object={scene} scale={0.7} position={[0, -0.18, 0]} />;
}

useGLTF.preload(DESK_PATH);
