"use client";

import React, {
  Suspense,
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  Center,
  Float,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { ConfiguratorShoe } from "../components/ConfiguratorShoe";

import { Loader3D } from "../components/Loader3D";
import { TopHeader } from "../components/TopHeader";
import { DesktopSidebar } from "../components/DesktopSidebar";
import { MaterialEditor } from "../components/MaterialEditor";
import { TextEditor } from "../components/TextEditor";

export default function ConfiguratorPage() {
  const uiRef = useRef<HTMLDivElement>(null);

  // Refs für GSAP Kamera & Modell Animation
  const groupRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  const { editMode, setEditMode } = useConfiguratorStore();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ==========================================
  // DYNAMISCHE KAMERA-POSITIONIERUNG (GSAP)
  // ==========================================
  useEffect(() => {
    if (!mounted) return;

    // Wenn Mobile UND TextEditor aktiv -> Schuh gleitet nach oben (1.3)
    // Wenn Mobile UND MaterialEditor aktiv -> Schuh bleibt unten (0.8)
    // Desktop bleibt stabil (0.3)
    const targetY = isMobile ? (editMode === "TEXT" ? 1.3 : 0.8) : 0.3;

    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: targetY,
        duration: 1,
        ease: "power3.inOut",
      });
    }
    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        y: 0.8 + targetY,
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, [editMode, isMobile, mounted]);

  // ==========================================
  // UI & UX HINT ANIMATIONEN
  // ==========================================
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. UI fährt von unten ein
      gsap.fromTo(
        ".conf-ui",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      // 2. UX Hint "Tap to edit" erscheint sanft
      gsap.fromTo(
        ".tap-hint",
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
          delay: 1.5,
        },
      );

      // 3. UX Hint verschwindet automatisch nach 7 Sekunden
      gsap.to(".tap-hint", {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: 0.5,
        ease: "power3.in",
        delay: 7,
      });
    }, uiRef);
    return () => ctx.revert();
  }, []);

  // Lässt den Hint sofort verschwinden, wenn der User interagiert
  const handleCanvasInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      gsap.to(".tap-hint", {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: 0.4,
        ease: "power3.in",
      });
    }
  };

  return (
    // FIX: overscroll-none blockiert das grausame "Bouncen" auf iOS Safari
    <div className="w-full h-[100dvh] bg-[#050505] overflow-hidden overscroll-none selection:bg-neutral-600 selection:text-white relative font-['Space_Grotesk']">
      {/* FIX: touch-none blockiert das Scrollen beim Drehen des 3D Modells */}
      <div
        className="absolute inset-0 z-0 cursor-move touch-none bg-black bg-[url('/images/studio-bg.jpg')] bg-cover bg-center bg-no-repeat"
        onPointerDown={handleCanvasInteraction}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

        <Canvas
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          camera={{ position: [3.5, 1, 4.5], fov: 45 }}
        >
          <ambientLight intensity={0.5} />
          <spotLight
            position={[5, 10, 5]}
            angle={0.4}
            penumbra={1}
            intensity={4}
            castShadow
          />
          <spotLight
            position={[-5, 5, -5]}
            angle={0.4}
            penumbra={1}
            intensity={2}
            color="#a3a3a3"
          />
          <Environment preset="city" environmentIntensity={1} />

          <Suspense fallback={<Loader3D />}>
            {/* GSAP kontrolliert jetzt die Y-Position! */}
            <group ref={groupRef} position={[0, 0.8, 0]}>
              <Center position={[0, 1.6, 0]}>
                <Float
                  speed={1.5}
                  rotationIntensity={0.1}
                  floatIntensity={0.4}
                  floatingRange={[-0.03, 0.03]}
                >
                  <ConfiguratorShoe />
                </Float>
              </Center>
              <ContactShadows
                position={[0, -0.2, 0]}
                opacity={0.9}
                scale={10}
                blur={2.5}
                far={4}
                color="#000000"
              />
            </group>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            target={[0, 1.6, 0]} // Wird von GSAP sofort überschrieben
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
          <EffectComposer enableNormalPass>
            <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.8} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </div>

      <div
        ref={uiRef}
        className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between"
      >
        <TopHeader />
        <DesktopSidebar />

        {/* ==========================================
            UX HINT: TAP TO EDIT (Mobile Only)
            ========================================== */}
        <div className="tap-hint md:hidden absolute top-[30%] left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-3 opacity-0">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <path d="M10 15v-6.5a1.5 1.5 0 0 1 3 0v7.5" />
              <path d="M13 13.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
              <path d="M16 12.5v-1.5a1.5 1.5 0 0 1 3 0v1.5" />
              <path d="M19 13.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-2c-2.5 0-5.3-2-6-4l-4.4-4.4a2 2 0 0 1 2.8-2.8l3.6 3.6v-12.2a1.5 1.5 0 1 1 3 0v10.5" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-white uppercase bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md shadow-xl">
            Tap shoe parts to edit
          </span>
        </div>

        <div className="mt-auto conf-ui pointer-events-auto w-full max-w-4xl mx-auto flex flex-col px-2 pb-2 md:px-8 md:pb-6 relative z-30">
          <div className="flex gap-4 md:gap-6 mb-1 md:mb-3 text-[9px] xl:text-[10px] font-bold tracking-[0.2em] justify-center md:justify-start drop-shadow-md">
            <button
              onClick={() => setEditMode("MATERIALS")}
              className={`transition-colors py-2 ${editMode === "MATERIALS" ? "text-white border-b-2 border-white" : "text-neutral-500"}`}
            >
              MATERIALS
            </button>
            <button
              onClick={() => setEditMode("TEXT")}
              className={`transition-colors py-2 ${editMode === "TEXT" ? "text-white border-b-2 border-white" : "text-neutral-500"}`}
            >
              CUSTOM TEXT
            </button>
          </div>

          <div className="bg-[#050505]/95 backdrop-blur-xl border border-neutral-900 rounded-xl p-3 pt-4 md:p-6 flex flex-col w-full shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            {editMode === "MATERIALS" ? <MaterialEditor /> : <TextEditor />}
          </div>
        </div>
      </div>
    </div>
  );
}
