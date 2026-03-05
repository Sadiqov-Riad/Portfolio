"use client";

import dynamic from "next/dynamic";
import HeroOverlay from "@/components/HeroOverlay";
import PageLoader from "@/components/PageLoader";

const ComputerScene = dynamic(
  () => import("@/components/ComputerScene"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#0e0e0f" }}>
      <PageLoader />
      <HeroOverlay />
      <ComputerScene />
    </main>
  );
}
