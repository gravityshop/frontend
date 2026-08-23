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

// ==========================================
// 1. DIE 3D SCHUH KOMPONENTE (MIT MATERIAL-MORPH)
// ==========================================
const ShoeModel = ({
  proxyRef,
}: {
  proxyRef: React.MutableRefObject<{ yRot: number; progress: number }>;
}) => {
  const { scene } = useGLTF("/3d_model/raw_shoe.glb");
  const modelRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Unsere Farb-Meilensteine für den Scroll-Effekt
  const colors = useMemo(
    () => [
      new THREE.Color("#ea580c"), // 66%: Industrial Orange
      new THREE.Color("#ffc300"), // Ende: Platinum / Chrome
      new THREE.Color("#386641"), // Start: Pitch Black
      new THREE.Color("#7f1d1d"), // 33%: Dark Red
    ],
    [],
  );

  // Zwischenspeicher für die Performance (damit wir nicht 60x pro Sekunde ein neues Objekt erstellen)
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Materialien klonen und veredeln, sobald das Modell geladen ist
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // Clone trennt unser Modell vom globalen Cache, damit wir es frei manipulieren können
          mesh.material = (mesh.material as THREE.Material).clone();
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.2; // Etwas Glanz
          mat.metalness = 0.6; // Stärkerer Metall-Look für Brutalismus
        }
      }
    });
  }, [scene]);

  // Der 60-FPS Render-Loop
  useFrame(() => {
    if (!modelRef.current) return;

    // 1. Rotation anwenden
    const p = proxyRef.current.progress;
    modelRef.current.rotation.y = proxyRef.current.yRot;

    // 2. Die exakte Morph-Farbe berechnen (Linear Interpolation)
    const maxIndex = colors.length - 1;
    const scaledProgress = p * maxIndex;
    const index = Math.floor(scaledProgress);
    const lerpFactor = scaledProgress - index;

    const c1 = colors[Math.min(index, maxIndex)];
    const c2 = colors[Math.min(index + 1, maxIndex)];

    // Mischt c1 und c2 basierend auf dem Scroll-Fortschritt (lerpFactor)
    tempColor.lerpColors(c1, c2, lerpFactor);

    // 3. Farbe auf alle Bauteile des Schuhs anwenden
    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        (mesh.material as THREE.MeshStandardMaterial).color.copy(tempColor);
      }
    });

    // 4. Dynamisches Licht: Je weiter wir scrollen, desto aggressiver wird das Spotlight
    if (lightRef.current) {
      // Startet bei Intensität 2 und geht bis auf 7 hoch
      lightRef.current.intensity = 2 + p * 5;
    }
  });

  return (
    <group>
      {/* Dynamisches Key-Light, das wir aus dem useFrame steuern */}
      <directionalLight
        ref={lightRef}
        position={[5, 10, 5]}
        color="#ffffff"
        intensity={2}
        castShadow
      />

      <group ref={modelRef} position={[0, -1, 0]}>
        {/* HIER DEINEN SCALE-WERT EINTRAGEN */}
        <primitive object={scene} scale={2} />
      </group>
    </group>
  );
};

// ==========================================
// 2. DIE HAUPT-SEKTION (GSAP & DOM)
// ==========================================
export default function ArchiveGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  // ERWEITERT: progress von 0 bis 1 hinzugefügt
  const proxyRef = useRef({ yRot: 0, progress: 0 });

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. INTRO
      gsap.fromTo(
        ".shoe-reveal",
        { opacity: 0, scale: 0.8, y: 100 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        },
      );

      // 2. DER 360-GRAD SCROLL MIT PROGRESS
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=200%", // 2 Bildschirmlängen scrollen für die volle Transformation
        },
      });

      tl.to(proxyRef.current, {
        yRot: Math.PI * 2,
        progress: 1, // Zieht den Progress-Wert synchron zur Rotation von 0 auf 1
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden border-y border-neutral-900 flex items-center justify-center"
    >
      {/* TEXT LAYER */}
      <div className="absolute bottom-100 inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="overflow-hidden mt-4">
          <p className="shoe-reveal font-['Space_Grotesk'] text-neutral-400 text-sm font-bold tracking-[0.3em] uppercase">
            Scroll to manipulate
          </p>
        </div>
      </div>

      {/* WEBGL LAYER */}
      <div className="shoe-reveal absolute inset-0 z-0 opacity-0">
        {/* HIER DEINEN FOV-WERT EINTRAGEN */}
        <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
          <ambientLight intensity={0.2} />
          {/* Basis-Ausleuchtung */}
          <Environment preset="city" environmentIntensity={0.5} />

          <Suspense fallback={null}>
            <ShoeModel proxyRef={proxyRef} />
            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.9}
              scale={5}
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
