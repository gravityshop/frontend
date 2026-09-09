"use client";

import React, { useRef, useLayoutEffect, useMemo, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ShoeModel = ({
  proxyRef,
}: {
  proxyRef: React.MutableRefObject<{ yRot: number; progress: number }>;
}) => {
  const { scene } = useGLTF("/3d_model/raw_shoe.glb");
  const modelRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  const colors = useMemo(
    () => [
      new THREE.Color("#ea580c"),
      new THREE.Color("#ffc300"),
      new THREE.Color("#386641"),
      new THREE.Color("#7f1d1d"),
    ],
    [],
  );

  const tempColor = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          mesh.material = (mesh.material as THREE.Material).clone();
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.2;
          mat.metalness = 0.6;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!modelRef.current) return;

    const p = proxyRef.current.progress;
    modelRef.current.rotation.y = proxyRef.current.yRot;

    const maxIndex = colors.length - 1;
    const scaledProgress = p * maxIndex;
    const index = Math.floor(scaledProgress);
    const lerpFactor = scaledProgress - index;

    const c1 = colors[Math.min(index, maxIndex)];
    const c2 = colors[Math.min(index + 1, maxIndex)];

    tempColor.lerpColors(c1, c2, lerpFactor);

    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        (mesh.material as THREE.MeshStandardMaterial).color.copy(tempColor);
      }
    });

    if (lightRef.current) {
      lightRef.current.intensity = 2 + p * 5;
    }
  });

  return (
    <group>
      <directionalLight
        ref={lightRef}
        position={[5, 10, 5]}
        color="#ffffff"
        intensity={2}
        castShadow
      />
      <group ref={modelRef} position={[0, -1, 0]}>
        <primitive object={scene} scale={2} />
      </group>
    </group>
  );
};

export default function ArchiveGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const proxyRef = useRef({ yRot: 0, progress: 0 });

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. FIX: KEIN SCALE! Nur noch Opacity Fade. Das rettet die WebGL Performance.
      gsap.fromTo(
        ".shoe-reveal",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          // 2. FIX: Scrub auf 0.1 reduziert (vorher 1). Verhindert, dass der Schuh dem Scrollen "hinterherlaggt".
          scrub: 0.1,
          start: "top top",
          end: "+=200%",
        },
      });

      tl.to(proxyRef.current, {
        yRot: Math.PI * 2,
        progress: 1,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      // 3. FIX: Zurück zu h-dvh ohne extra Wrapper. Clean und stabil.
      className="relative w-full h-dvh bg-[#050505] overflow-hidden border-y border-neutral-900 flex items-center justify-center"
    >
      <div className="absolute bottom-16 md:bottom-24 inset-x-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="overflow-hidden mt-4 px-4 text-center">
          <p className="shoe-reveal opacity-0 font-['Space_Grotesk'] text-neutral-400 text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">
            Scroll to manipulate
          </p>
        </div>
      </div>

      <div className="shoe-reveal absolute inset-0 z-0 opacity-0">
        {/* 4. FIX: dpr={[1, 2]} begrenzt die Pixeldichte auf High-Res Displays -> enormer Performance-Boost */}
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <Environment preset="city" environmentIntensity={0.5} />
          <Suspense fallback={null}>
            <ShoeModel proxyRef={proxyRef} />
            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.9}
              scale={4.5}
              blur={2.5}
              far={4}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}

useGLTF.preload("/3d_model/raw_shoe.glb");
