"use client";

import dynamic from "next/dynamic";

const ComputerScene = dynamic(
  () => import("@/components/ComputerScene"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-warm">
      <ComputerScene />
    </main>
  );
}
