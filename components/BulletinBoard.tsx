"use client";

import { useGLTF } from "@react-three/drei";

const BOARD_PATH = "/models/source/bulletin_board.glb";

export default function BulletinBoard() {
  const { scene } = useGLTF(BOARD_PATH);
  return (
    <primitive
      object={scene}
      position={[0, 0.72, -0.68]}
      rotation={[0, 0, 0]}
      scale={0.85}
    />
  );
}

useGLTF.preload(BOARD_PATH);
