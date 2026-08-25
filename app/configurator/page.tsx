"use client";

import React, { Suspense, useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  Html,
  useProgress,
  Center,
} from "@react-three/drei";
import {
  useConfiguratorStore,
  PREMIUM_MATERIALS,
} from "@/store/useConfiguratorStore";
import { ConfiguratorShoe } from "../components/ConfiguratorShoe";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="font-['Anton'] text-2xl md:text-4xl text-white uppercase tracking-widest whitespace-nowrap">
        LOADING // {Math.round(progress)}%
      </div>
    </Html>
  );
}

export default function ConfiguratorPage() {
  const uiRef = useRef<HTMLDivElement>(null);

  const {
    activeZone,
    setActiveZone,
    materials,
    setZoneMaterial,
    customText,
    setCustomText,
    textColor,
    setTextColor,
    decalPos,
    decalRot,
    decalScale,
    setDecalTransform,
    cameraView,
    setCameraView,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
    snapshotImage,
  } = useConfiguratorStore();

  const [editMode, setEditMode] = useState<"MATERIALS" | "TEXT">("MATERIALS");

  const BASE_PRICE = 290;
  const totalPrice =
    BASE_PRICE +
    Object.values(materials).reduce((acc, mat) => acc + mat.priceOffset, 0);

  const zones = [
    { id: "zohle", label: "SOLE UNIT" },
    { id: "vorne", label: "TOE GUARD" },
    { id: "vorne-oben", label: "UPPER TOE" },
    { id: "seiten", label: "LATERAL SIDES" },
    { id: "seiten-oben", label: "UPPER SIDES" },
    { id: "hinter", label: "HEEL COUNTER" },
    { id: "hinter-oben", label: "UPPER HEEL" },
    { id: "All", label: "BASE MESH" },
  ];

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

  const handleCapture = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      openCheckout(imgData);
    }
  };

  return (
    // h-[100dvh] verhindert auf dem Handy das Scrollen durch die Adressleiste
    <div className="w-full h-[100dvh] bg-[#050505] overflow-hidden selection:bg-neutral-600 selection:text-white relative font-['Space_Grotesk']">
      {/* 3D CANVAS */}
      <div className="absolute inset-0 z-0 cursor-move bg-[radial-gradient(ellipse_at_center,_#262626_0%,_#050505_70%)]">
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
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

          <Suspense fallback={<Loader />}>
            <Center position={[0, 0.8, 0]}>
              <ConfiguratorShoe />
            </Center>
            <ContactShadows
              position={[0, -0.2, 0]}
              opacity={0.9}
              scale={10}
              blur={2.5}
              far={4}
              color="#000000"
            />
          </Suspense>

          <OrbitControls
            target={[0, 0.8, 0]}
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        </Canvas>
      </div>

      {/* UI OVERLAY */}
      <div
        ref={uiRef}
        className={`absolute inset-0 z-10 pointer-events-none flex flex-col justify-between transition-opacity duration-500 ${isCheckoutOpen ? "opacity-0" : "opacity-100"}`}
      >
        {/* HEADER */}
        <header className="flex justify-between items-start conf-ui pointer-events-auto p-4 md:p-12">
          <Link
            href="/"
            className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors"
          >
            ← Abort
          </Link>
          <div className="text-right flex flex-col items-end">
            <h1 className="font-['Anton'] text-3xl md:text-5xl text-white uppercase leading-none tracking-wider drop-shadow-md">
              CONFIGURE
            </h1>
            <div className="text-sm md:text-xl text-white font-bold tracking-widest mt-1 md:mt-2">
              € {totalPrice.toFixed(2)}
            </div>

            {/* KAMERA (Auf Mobile versteckt für mehr Platz) */}
            <div className="hidden md:flex gap-3 mt-4 text-[9px] font-bold tracking-[0.3em] uppercase">
              {(["PROFILE", "FRONT", "HEEL", "TOP"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCameraView(view)}
                  className={`px-3 py-1 border transition-colors ${cameraView === view ? "border-white text-white" : "border-neutral-800 text-neutral-500 hover:text-white"}`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ==========================================
            UX FIX: DESKTOP LEFT MENU
        ========================================== */}
        <div className="hidden md:flex flex-col gap-2 absolute left-12 top-1/2 -translate-y-1/2 pointer-events-auto conf-ui">
          {editMode === "MATERIALS" &&
            zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`text-left text-sm font-bold tracking-[0.2em] uppercase py-3 px-6 border-l-2 transition-all duration-300 ${activeZone === zone.id ? "border-white text-white bg-white/10" : "border-transparent text-neutral-500 hover:text-white"}`}
              >
                {zone.label}
              </button>
            ))}
        </div>

        {/* ==========================================
            UX FIX: MOBILE & BOTTOM HUD
        ========================================== */}
        <div className="mt-auto conf-ui pointer-events-auto w-full max-w-6xl mx-auto flex flex-col p-4 md:p-8">
          {/* TAB SWITCHER */}
          <div className="flex gap-6 mb-4 md:mb-6 text-xs font-bold tracking-[0.2em] justify-center md:justify-start">
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

          <div className="bg-[#050505]/95 backdrop-blur-xl border border-neutral-900 rounded-lg p-4 md:p-8 flex flex-col w-full shadow-2xl">
            {editMode === "MATERIALS" ? (
              <div className="flex flex-col w-full">
                {/* MOBILE ZONES: Horizontales Scrollen */}
                <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-neutral-900 custom-scrollbar">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZone(zone.id)}
                      className={`whitespace-nowrap text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-colors ${activeZone === zone.id ? "bg-white text-black" : "bg-neutral-900 text-neutral-400"}`}
                    >
                      {zone.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full justify-between items-center">
                  <div className="flex flex-col w-full overflow-hidden">
                    <span className="hidden md:block text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-4">
                      Material for:{" "}
                      <span className="text-white">
                        {zones.find((z) => z.id === activeZone)?.label}
                      </span>
                    </span>

                    {/* MATERIAL CARDS */}
                    <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x">
                      {PREMIUM_MATERIALS.map((mat) => (
                        <button
                          key={mat.name}
                          onClick={() => setZoneMaterial(activeZone, mat)}
                          className={`snap-center shrink-0 w-24 h-32 md:w-28 md:h-36 rounded-md flex flex-col items-center justify-center p-2 border-2 transition-all ${materials[activeZone as keyof typeof materials].name === mat.name ? "border-white bg-white/5" : "border-neutral-900 hover:border-neutral-700 bg-neutral-950"}`}
                        >
                          <div
                            className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-neutral-700 mb-3 shadow-inner"
                            style={{
                              backgroundColor: mat.hex,
                              backgroundImage: mat.textureUrl
                                ? `url(${mat.textureUrl})`
                                : "none",
                              backgroundSize: "cover",
                            }}
                          />
                          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white text-center leading-tight">
                            {mat.name}
                          </span>
                          {mat.priceOffset > 0 && (
                            <span className="text-[8px] text-neutral-400 mt-1">
                              +{mat.priceOffset}€
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCapture}
                    className="bg-white shrink-0 text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-4 md:py-6 px-6 md:px-10 hover:bg-neutral-300 transition-colors w-full md:w-auto mt-2 md:mt-0"
                  >
                    FINALIZE
                  </button>
                </div>
              </div>
            ) : (
              // CUSTOM TEXT MODE
              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-between pb-2">
                  <div className="flex items-center gap-4 w-full max-w-md">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="ENTER TEXT"
                      className="bg-transparent border-b border-neutral-800 py-2 font-['Anton'] text-xl md:text-2xl tracking-widest text-white focus:outline-none focus:border-white w-full uppercase"
                    />
                    <div className="relative w-10 h-10 border border-neutral-700 overflow-hidden shrink-0">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCapture}
                    className="bg-white shrink-0 text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-3 md:py-4 px-6 md:px-8 hover:bg-neutral-300 transition-colors w-full md:w-auto"
                  >
                    FINALIZE
                  </button>
                </div>

                {/* CALIBRATION SLIDERS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-[9px] tracking-widest text-neutral-400 pt-4 border-t border-neutral-900">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white">POS (X,Y,Z)</span>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.01"
                      value={decalPos[0]}
                      onChange={(e) =>
                        setDecalTransform("pos", 0, parseFloat(e.target.value))
                      }
                    />
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.01"
                      value={decalPos[1]}
                      onChange={(e) =>
                        setDecalTransform("pos", 1, parseFloat(e.target.value))
                      }
                    />
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.01"
                      value={decalPos[2]}
                      onChange={(e) =>
                        setDecalTransform("pos", 2, parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white">ROT (X,Y,Z)</span>
                    <input
                      type="range"
                      min="-3.14"
                      max="3.14"
                      step="0.01"
                      value={decalRot[0]}
                      onChange={(e) =>
                        setDecalTransform("rot", 0, parseFloat(e.target.value))
                      }
                    />
                    <input
                      type="range"
                      min="-3.14"
                      max="3.14"
                      step="0.01"
                      value={decalRot[1]}
                      onChange={(e) =>
                        setDecalTransform("rot", 1, parseFloat(e.target.value))
                      }
                    />
                    <input
                      type="range"
                      min="-3.14"
                      max="3.14"
                      step="0.01"
                      value={decalRot[2]}
                      onChange={(e) =>
                        setDecalTransform("rot", 2, parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white">SCALE (X,Y,Z)</span>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={decalScale[0]}
                      onChange={(e) =>
                        setDecalTransform(
                          "scale",
                          0,
                          parseFloat(e.target.value),
                        )
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={decalScale[1]}
                      onChange={(e) =>
                        setDecalTransform(
                          "scale",
                          1,
                          parseFloat(e.target.value),
                        )
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={decalScale[2]}
                      onChange={(e) =>
                        setDecalTransform(
                          "scale",
                          2,
                          parseFloat(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT OVERLAY BLEIBT IDENTISCH */}
      {isCheckoutOpen && snapshotImage && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
          <div className="bg-[#0a0a0a] border border-neutral-800 w-full max-w-6xl flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[80vh] overflow-hidden">
            <div className="w-full md:w-1/2 bg-[#020202] relative p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
              <button
                onClick={closeCheckout}
                className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.3em] text-neutral-500 hover:text-white uppercase z-10"
              >
                ← Edit
              </button>
              <img
                src={snapshotImage}
                alt="Custom Sneaker"
                className="w-full h-full object-contain drop-shadow-2xl relative z-0"
              />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto custom-scrollbar flex flex-col justify-between">
              <div>
                <h2 className="font-['Anton'] text-3xl md:text-5xl text-white uppercase mb-2">
                  Prototype 001
                </h2>
                <div className="text-neutral-500 text-[10px] tracking-[0.3em] font-bold mb-8 md:mb-12">
                  CUSTOM ARCHITECTURE // VERIFIED
                </div>
                <div className="space-y-4 border-b border-neutral-900 pb-8 mb-8">
                  {Object.entries(materials).map(([zone, mat]) => (
                    <div
                      key={zone}
                      className="flex justify-between items-center text-[9px] md:text-[10px] tracking-widest uppercase"
                    >
                      <span className="text-neutral-500">
                        {zones.find((z) => z.id === zone)?.label}
                      </span>
                      <span className="text-white flex items-center gap-3">
                        {mat.name}{" "}
                        <div
                          className="w-3 h-3 rounded-full border border-neutral-700"
                          style={{
                            backgroundColor: mat.hex,
                            backgroundImage: mat.textureUrl
                              ? `url(${mat.textureUrl})`
                              : "none",
                            backgroundSize: "cover",
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
                    Total
                  </span>
                  <span className="font-['Anton'] text-3xl md:text-5xl text-white">
                    € {totalPrice.toFixed(2)}
                  </span>
                </div>
                <button className="w-full bg-white text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-4 md:py-6 hover:bg-neutral-300 transition-colors">
                  Authorize Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
