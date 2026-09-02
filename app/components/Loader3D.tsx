"use client";

import { Html, useProgress } from "@react-three/drei";

export function Loader3D() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="font-['Anton'] text-2xl md:text-4xl text-red-500 uppercase tracking-widest whitespace-nowrap">
        LOADING // {Math.round(progress)}%
      </div>
    </Html>
  );
}
