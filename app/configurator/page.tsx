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
  const groupRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  const { editMode, setEditMode } = useConfiguratorStore();
  const [screenSize, setScreenSize] = useState<"mobile" | "laptop" | "desktop">(
    "desktop",
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize("mobile");
      else if (width < 1440) setScreenSize("laptop");
      else setScreenSize("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Schuh perfekt zentrieren, da unten jetzt kein klobiges UI mehr ist!
  const yOffset = !mounted ? 0 : screenSize === "mobile" ? 0.2 : 0;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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

      const tl = gsap.timeline({ delay: 0.8 });
      tl.fromTo(
        ".zoom-hint",
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
      )
        .to(".zoom-hint-icon", {
          scale: 1.3,
          duration: 0.4,
          yoyo: true,
          repeat: 3,
          ease: "power2.inOut",
        })
        .to(
          ".zoom-hint",
          { opacity: 0, scale: 0.8, y: -20, duration: 0.5, ease: "power3.in" },
          "+=0.2",
        );
    }, uiRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-dvh bg-[#050505] overflow-hidden overscroll-none selection:bg-neutral-600 selection:text-white relative font-['Space_Grotesk']">
      <div
        className={`absolute left-0 right-0 z-0 cursor-move touch-none bg-black bg-[url('/images/studio-bg.jpg')] bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${screenSize === "mobile" ? "top-[-15vh] h-[115dvh]" : "top-0 h-dvh"}`}
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
            target={[0, 1.5 + yOffset, 0]}
            enablePan={false}
            minDistance={4}
            maxDistance={7}
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
        {/* LINKS: Sidebar (Bleibt links) */}
        <DesktopSidebar />

        {/* OBEN: Top Header (Mittig) */}
        <TopHeader />

        {/* HINT: Pinch to Zoom (Mitte unten) */}
        <div className="zoom-hint absolute bottom-[12%] xl:bottom-[15%] left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-3 opacity-0">
          <div className="zoom-hint-icon w-14 h-14 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
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

        {/* ==========================================
            EDITOR PANEL: GANZ RECHTS & VERTIKAL
            ========================================== */}
        <div
          className="conf-ui pointer-events-auto relative z-30 flex flex-col w-full
          /* MOBILE: Unten angedockt, volle Breite */
          mt-auto px-3 pb-3
          /* DESKTOP/MACBOOK: Schmale vertikale Leiste auf der RECHTEN SEITE, zentriert */
          md:absolute md:top-1/2 md:-translate-y-1/2 md:right-6 xl:right-10 md:w-[120px] xl:w-[130px] md:mt-0 md:px-0 md:pb-0 md:items-end"
        >
          {/* TABS: Auf Mobile horizontal, auf Desktop als vertikales Menü mit Rahmen rechts (wie Sidebar!) */}
          <div className="flex md:flex-col gap-4 md:gap-2 mb-2 md:mb-3 text-[9px] xl:text-[10px] font-bold tracking-[0.2em] justify-center md:items-end drop-shadow-md md:pr-3">
            <button
              onClick={() => setEditMode("MATERIALS")}
              className={`transition-all duration-300 py-1 ${editMode === "MATERIALS" ? "text-white border-b-2 md:border-b-0 md:border-r-2 border-white md:pr-3" : "text-neutral-500 hover:text-neutral-300 md:pr-3 md:border-r-2 md:border-transparent"}`}
            >
              MATERIALS
            </button>
            <button
              onClick={() => setEditMode("TEXT")}
              className={`transition-all duration-300 py-1 ${editMode === "TEXT" ? "text-white border-b-2 md:border-b-0 md:border-r-2 border-white md:pr-3" : "text-neutral-500 hover:text-neutral-300 md:pr-3 md:border-r-2 md:border-transparent"}`}
            >
              TEXT
            </button>
          </div>

          {/* EDITOR BOX: Begrenzte Höhe für Scroll, schmal, erzwingt vertikales Layout im Child */}
          <div className="bg-[#050505]/80 backdrop-blur-3xl border border-white/5 rounded-2xl p-3 md:p-4 flex flex-col w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-0">
            {editMode === "MATERIALS" ? <MaterialEditor /> : <TextEditor />}
          </div>
        </div>
      </div>
    </div>
  );
}
