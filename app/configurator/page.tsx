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

  // FIX: Da das UI unten nun viel flacher ist, muss der Schuh nicht mehr so extrem weit nach oben.
  const yOffset = mounted && isMobile ? 0.8 : 0.3;

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
    }, uiRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-dvh bg-[#050505] overflow-hidden selection:bg-neutral-600 selection:text-white relative font-['Space_Grotesk']">
      <div className="absolute inset-0 z-0 cursor-move bg-black bg-[url('/images/studio-bg.jpg')] bg-cover bg-center bg-no-repeat">
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
            <group position={[0, yOffset, 0]}>
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
            target={[0, 0.8 + yOffset, 0]}
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

        {/* FIX: Paddings auf Mobile stark reduziert (px-2 pb-2 statt px-4 pb-4) */}
        <div className="mt-auto conf-ui pointer-events-auto w-full max-w-4xl mx-auto flex flex-col px-2 pb-2 md:px-8 md:pb-6 relative z-30">
          {/* FIX: Margin-Bottom der Tabs reduziert */}
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

          {/* FIX: Inneres Padding der schwarzen Box für Mobile gestaucht (p-3 pt-4 statt p-4) */}
          <div className="bg-[#050505]/95 backdrop-blur-xl border border-neutral-900 rounded-xl p-3 pt-4 md:p-6 flex flex-col w-full shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            {editMode === "MATERIALS" ? <MaterialEditor /> : <TextEditor />}
          </div>
        </div>
      </div>
    </div>
  );
}
