"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const CUP_PATH = "/models/source/coffee_cup.glb";

const CUP_POSITION: [number, number, number] = [0.38, -0.005, 0.2];
const CUP_ROTATION: [number, number, number] = [0, -0.45, 0];
const CUP_SCALE = 0.06;

function Smoke() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Texture for the steam
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      x: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.005,
      speed: 0.004 + Math.random() * 0.005, 
      offset: Math.random() * Math.PI * 100,
      scale: 0.04 + Math.random() * 0.03,
      sway: 0.2 + Math.random() * 0.3,
      driftX: (Math.random() - 0.5) * 0.01,
      driftZ: (Math.random() - 0.5) * 0.01,
      rotSpeed: (Math.random() - 0.5) * 0.05,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    groupRef.current.children.forEach((sprite, i) => {
      const p = particles[i];
      const rawY = ((t * p.speed + p.offset) % 0.4);
      const y = rawY + 0.06; 
      
      sprite.position.y = y;
      
      const spread = rawY * rawY * 0.5; 
      sprite.position.x = p.x + Math.sin(t * p.sway + p.offset) * 0.01 + p.driftX * rawY + Math.sin(rawY * 5) * spread;
      sprite.position.z = p.z + Math.cos(t * (p.sway * 0.8) + p.offset) * 0.01 + p.driftZ * rawY + Math.cos(rawY * 5) * spread;

      const scaleX = p.scale + rawY * 0.4;
      const scaleY = p.scale + rawY * 0.45; 
      sprite.scale.set(scaleX, scaleY, 1);

      const mat = (sprite as THREE.Sprite).material;
      const life = rawY / 0.4; 
      
      mat.opacity = Math.max(0, Math.sin(life * Math.PI) * 0.35); 
      
      mat.rotation = t * p.rotSpeed + p.offset;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {particles.map((_, i) => (
        <sprite key={i}>
          <spriteMaterial 
            map={texture} 
            transparent 
            opacity={0} 
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

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
      <Smoke />
    </group>
  );
}

useGLTF.preload(CUP_PATH);
