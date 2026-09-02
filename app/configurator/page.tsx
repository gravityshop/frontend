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

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const yOffset = mounted && isMobile ? 0.2 : 0.3;

  // ==========================================
  // UI & ZOOM-HINT ANIMATION
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

      // 2. SENIOR UX: Zoom In/Out Hand Animation (Timeline)
      const tl = gsap.timeline({ delay: 0.8 }); // Startet kurz nachdem das UI da ist

      tl.fromTo(
        ".zoom-hint",
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
      )
        // Der "Zoom In/Out" Pumping Effekt (skaliert hoch und runter)
        .to(".zoom-hint-icon", {
          scale: 1.3,
          duration: 0.4,
          yoyo: true, // Animiert automatisch wieder zurück auf scale: 1
          repeat: 3, // 3 Wiederholungen (rein, raus, rein, raus...)
          ease: "power2.inOut",
        })
        // Nach ~2 Sekunden verschwindet der Hint sanft nach oben
        .to(
          ".zoom-hint",
          {
            opacity: 0,
            scale: 0.8,
            y: -20,
            duration: 0.5,
            ease: "power3.in",
          },
          "+=0.2",
        ); // Kurze Pause vor dem Verschwinden
    }, uiRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-dvh bg-[#050505] overflow-hidden overscroll-none selection:bg-neutral-600 selection:text-white relative font-['Space_Grotesk']">
      <div
        className={`absolute left-0 right-0 z-0 cursor-move touch-none bg-black bg-[url('/images/studio-bg.jpg')] bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isMobile ? "top-[-15vh] h-[115dvh]" : "top-0 h-dvh"}`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

        <Canvas
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          camera={{ position: [8.5, 1, 4.5], fov: 45 }}
        >
          <ambientLight intensity={0.1} />
          <spotLight
            position={[5, 10, 5]}
            angle={2.4}
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
          <Environment preset="city" environmentIntensity={0.6} />

          <Suspense fallback={<Loader3D />}>
            <group ref={groupRef} position={[0, yOffset, 0]}>
              <Center position={[0, 1.3, 0]}>
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
            target={[0, 0.8 + yOffset, 0]}
            enablePan={false}
            minDistance={4}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
          <EffectComposer enableNormalPass>
            <Bloom luminanceThreshold={0.8} intensity={0.8} />
            <Vignette offset={0.1} darkness={1.1} />
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
            UX HINT: ZOOM / INTERACT (Immer beim Laden)
            ========================================== */}
        <div className="zoom-hint absolute top-[35%] left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-3 opacity-0">
          <div className="zoom-hint-icon w-14 h-14 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {/* SVG Hand mit Zeigefinger */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 15v-6.5a1.5 1.5 0 0 1 3 0v7.5" />
              <path d="M13 13.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
              <path d="M16 12.5v-1.5a1.5 1.5 0 0 1 3 0v1.5" />
              <path d="M19 13.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-2c-2.5 0-5.3-2-6-4l-4.4-4.4a2 2 0 0 1 2.8-2.8l3.6 3.6v-12.2a1.5 1.5 0 1 1 3 0v10.5" />
            </svg>
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase bg-black/60 px-5 py-2 rounded-full backdrop-blur-md shadow-xl text-center">
            Pinch to Zoom <br />{" "}
            <span className="text-[8px] text-neutral-400">& Tap to Edit</span>
          </span>
        </div>

        <div className="mt-auto conf-ui pointer-events-auto w-full max-w-7xl mx-auto flex flex-col px-2 pb-2 md:px-8 md:pb-6 relative z-30">
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

          <div className="bg-[#050505] backdrop-blur-xl border border-neutral-900 rounded-xl p-3 pt-4 md:p-6 flex flex-col w-full shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            {editMode === "MATERIALS" ? <MaterialEditor /> : <TextEditor />}
          </div>
        </div>
      </div>
    </div>
  );
}
