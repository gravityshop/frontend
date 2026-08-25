"use client";

import React, {
  Suspense,
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
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
    editMode,
    setEditMode,
    activeZone,
    setActiveZone,
    materials,
    setZoneMaterial,
    setColor,
    decals,
    selectedDecalId,
    setSelectedDecalId,
    updateDecal,
    removeDecal,
    cameraView,
    setCameraView,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
    snapshotImage,
  } = useConfiguratorStore();

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // BUGFIX: Auto-Scroll robuster gemacht (mit Timeout), damit React das DOM in Ruhe zeichnen kann
  useEffect(() => {
    if (editMode !== "MATERIALS") return;
    const timer = setTimeout(() => {
      const activeBtn = document.getElementById(`zone-btn-${activeZone}`);
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeZone, editMode]);

  const yOffset = mounted && isMobile ? 12 : 0;
  const totalPrice =
    290 +
    Object.values(materials).reduce((acc, mat) => acc + mat.priceOffset, 0);

  // UX UPDATE: BASE MESH WURDE HIER KOMPLETT GELÖSCHT!
  const zones = [
    { id: "schnuehsenkel", label: "LACES" },
    { id: "schuhzuenge", label: "TONGUE" },
    { id: "zohle", label: "SOLE UNIT" },
    { id: "unten", label: "BOTTOM TREAD" },
    { id: "vorne", label: "TOE GUARD" },
    { id: "vorne-oben", label: "UPPER TOE" },
    { id: "seiten", label: "LATERAL SIDES" },
    { id: "seiten-oben", label: "UPPER SIDES" },
    { id: "seiten-hinter", label: "REAR SIDES" },
    { id: "seiten-unten", label: "LOWER SIDES" },
    { id: "hinter", label: "HEEL COUNTER" },
    { id: "hinter-oben", label: "UPPER HEEL" },
    { id: "innen", label: "LINING (INSIDE)" },
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

  const activeDecal = decals.find((d) => d.id === selectedDecalId);

  const handleSliderChange = (
    axis: 0 | 1 | 2,
    val: number,
    type: "pos" | "rot" | "scale",
  ) => {
    if (!activeDecal) return;
    const newArr = [...activeDecal[type]] as [number, number, number];
    newArr[axis] = val;
    updateDecal(activeDecal.id, { [type]: newArr });
  };

  return (
    <div className="w-full h-dvh bg-[#050505] overflow-hidden selection:bg-neutral-600 selection:text-white relative font-['Space_Grotesk']">
      <div className="absolute inset-0 z-0 cursor-move bg-[radial-gradient(ellipse_at_center,#262626_0%,#050505_70%)]">
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [1, 0.5, 4.5], fov: 45 }}
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
            <group position={[0, yOffset, 0]}>
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
            </group>
          </Suspense>
          <OrbitControls
            target={[0, 0.1 + yOffset, 0]}
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        </Canvas>
      </div>

      <div
        ref={uiRef}
        className={`absolute inset-0 z-10 pointer-events-none flex flex-col justify-between transition-opacity duration-500 ${isCheckoutOpen ? "opacity-0" : "opacity-100"}`}
      >
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

        <div className="hidden md:flex flex-col gap-2 absolute left-12 top-1/2 -translate-y-1/2 pointer-events-auto conf-ui">
          {editMode === "MATERIALS" &&
            zones.map((zone) => (
              <button
                key={zone.id}
                id={`zone-btn-desktop-${zone.id}`}
                onClick={() => setActiveZone(zone.id)}
                className={`text-left text-sm font-bold tracking-[0.2em] uppercase py-3 px-6 border-l-2 transition-all duration-300 ${activeZone === zone.id ? "border-white text-white bg-white/10" : "border-transparent text-neutral-500 hover:text-white"}`}
              >
                {zone.label}
              </button>
            ))}
        </div>

        <div className="mt-auto conf-ui pointer-events-auto w-full max-w-6xl mx-auto flex flex-col px-2 pb-4 md:px-8 md:pb-8">
          <div className="flex gap-4 md:gap-6 mb-2 md:mb-6 text-[10px] md:text-xs font-bold tracking-[0.2em] justify-center md:justify-start drop-shadow-md">
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

          <div className="bg-[#050505]/95 backdrop-blur-xl border border-neutral-900 rounded-xl p-3 md:p-8 flex flex-col w-full shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            {editMode === "MATERIALS" ? (
              <div className="flex flex-col w-full">
                <div className="md:hidden flex overflow-x-auto gap-2 pb-2 mb-2 border-b border-neutral-900 custom-scrollbar">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      id={`zone-btn-${zone.id}`}
                      onClick={() => setActiveZone(zone.id)}
                      className={`whitespace-nowrap text-[8px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-md transition-colors ${activeZone === zone.id ? "bg-white text-black" : "bg-neutral-900 text-neutral-400"}`}
                    >
                      {zone.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:gap-6 w-full justify-between items-start md:items-center">
                  <div className="flex flex-col w-full overflow-hidden">
                    <div className="flex justify-between items-center mb-2 md:mb-4 gap-2">
                      <span className="hidden md:block text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500">
                        Material for:{" "}
                        <span className="text-white">
                          {zones.find((z) => z.id === activeZone)?.label}
                        </span>
                      </span>

                      <div className="flex items-center justify-between md:justify-start gap-2 bg-[#0a0a0a] p-1.5 md:p-2 rounded-lg border border-neutral-800 w-full md:w-auto shadow-inner">
                        <span className="text-[8px] md:text-[9px] text-neutral-500 tracking-[0.2em] uppercase ml-1 md:ml-2">
                          Paint
                        </span>
                        <div className="flex items-center">
                          <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full border border-neutral-700 overflow-hidden shrink-0 shadow-inner">
                            <input
                              type="color"
                              value={
                                materials[activeZone as keyof typeof materials]
                                  ?.hex || "#ffffff"
                              }
                              onChange={(e) =>
                                setColor(activeZone, e.target.value)
                              }
                              className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={
                              materials[
                                activeZone as keyof typeof materials
                              ]?.hex.toUpperCase() || ""
                            }
                            onChange={(e) =>
                              setColor(activeZone, e.target.value)
                            }
                            className="bg-transparent border-none py-1 font-['Space_Grotesk'] text-[10px] md:text-xs tracking-widest text-white focus:outline-none w-16 md:w-20 uppercase text-center mx-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar snap-x">
                      {PREMIUM_MATERIALS.map((mat) => (
                        <button
                          key={mat.name}
                          onClick={() => setZoneMaterial(activeZone, mat)}
                          className={`snap-center shrink-0 w-16 h-24 md:w-28 md:h-36 rounded-md flex flex-col items-center justify-center p-1 md:p-2 border-2 transition-all ${materials[activeZone as keyof typeof materials]?.name === mat.name ? "border-white bg-white/10" : "border-neutral-900 hover:border-neutral-700 bg-[#0a0a0a]"}`}
                        >
                          <div
                            className="w-6 h-6 md:w-14 md:h-14 rounded-full border border-neutral-700 mb-1.5 md:mb-2 shadow-inner"
                            style={{
                              backgroundColor: mat.hex,
                              backgroundImage: mat.textureUrl
                                ? `url(${mat.textureUrl})`
                                : "none",
                              backgroundSize: "cover",
                            }}
                          />
                          <span className="text-[7px] md:text-[10px] uppercase tracking-widest text-white text-center leading-tight">
                            {mat.name}
                          </span>
                          {mat.priceOffset > 0 && (
                            <span className="text-[6px] md:text-[8px] text-neutral-400 mt-0.5 md:mt-1">
                              +{mat.priceOffset}€
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCapture}
                    className="bg-white shrink-0 text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-3 md:py-6 px-6 md:px-10 hover:bg-neutral-300 transition-colors w-full md:w-auto mt-2 md:mt-0 rounded-sm"
                  >
                    FINALIZE
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2 md:gap-4">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                  {decals.map((decal) => (
                    <div
                      key={decal.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors shrink-0 ${selectedDecalId === decal.id ? "border-white bg-white/10" : "border-neutral-800 bg-black"}`}
                    >
                      <button
                        onClick={() => setSelectedDecalId(decal.id)}
                        className="text-[9px] md:text-[10px] font-bold tracking-widest text-white uppercase min-w-10 text-left"
                      >
                        {decal.text || "EMPTY"}
                      </button>
                      <button
                        onClick={() => removeDecal(decal.id)}
                        className="text-neutral-500 hover:text-red-500 text-xs ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-neutral-500 uppercase px-3 py-2 border border-dashed border-neutral-800 rounded-full shrink-0">
                    + DOUBLE CLICK SHOE TO ADD TEXT
                  </div>
                </div>

                {activeDecal ? (
                  <>
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full justify-between pb-2">
                      <div className="flex items-center gap-2 md:gap-4 w-full max-w-md">
                        <input
                          type="text"
                          value={activeDecal.text}
                          onChange={(e) =>
                            updateDecal(activeDecal.id, {
                              text: e.target.value.toUpperCase().slice(0, 10),
                            })
                          }
                          placeholder="ENTER TEXT"
                          className="bg-transparent border-b border-neutral-800 py-1 md:py-2 font-['Anton'] text-lg md:text-2xl tracking-widest text-white focus:outline-none focus:border-white w-full uppercase"
                        />
                        <div className="relative w-8 h-8 md:w-10 md:h-10 border border-neutral-700 overflow-hidden shrink-0 rounded-sm">
                          <input
                            type="color"
                            value={activeDecal.color}
                            onChange={(e) =>
                              updateDecal(activeDecal.id, {
                                color: e.target.value,
                              })
                            }
                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleCapture}
                        className="bg-white shrink-0 text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-2 md:py-4 px-6 md:px-8 hover:bg-neutral-300 transition-colors w-full md:w-auto rounded-sm"
                      >
                        FINALIZE
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full text-[8px] md:text-[9px] tracking-widest text-neutral-400 pt-2 md:pt-4 border-t border-neutral-900">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white">
                          POS (X,Y,Z)
                        </span>
                        <input
                          type="range"
                          min="-3"
                          max="3"
                          step="0.01"
                          value={activeDecal.pos[0]}
                          onChange={(e) =>
                            handleSliderChange(
                              0,
                              parseFloat(e.target.value),
                              "pos",
                            )
                          }
                        />
                        <input
                          type="range"
                          min="-3"
                          max="3"
                          step="0.01"
                          value={activeDecal.pos[1]}
                          onChange={(e) =>
                            handleSliderChange(
                              1,
                              parseFloat(e.target.value),
                              "pos",
                            )
                          }
                        />
                        <input
                          type="range"
                          min="-3"
                          max="3"
                          step="0.01"
                          value={activeDecal.pos[2]}
                          onChange={(e) =>
                            handleSliderChange(
                              2,
                              parseFloat(e.target.value),
                              "pos",
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white">
                          ROT (X,Y,Z)
                        </span>
                        <input
                          type="range"
                          min="-3.14"
                          max="3.14"
                          step="0.01"
                          value={activeDecal.rot[0]}
                          onChange={(e) =>
                            handleSliderChange(
                              0,
                              parseFloat(e.target.value),
                              "rot",
                            )
                          }
                        />
                        <input
                          type="range"
                          min="-3.14"
                          max="3.14"
                          step="0.01"
                          value={activeDecal.rot[1]}
                          onChange={(e) =>
                            handleSliderChange(
                              1,
                              parseFloat(e.target.value),
                              "rot",
                            )
                          }
                        />
                        <input
                          type="range"
                          min="-3.14"
                          max="3.14"
                          step="0.01"
                          value={activeDecal.rot[2]}
                          onChange={(e) =>
                            handleSliderChange(
                              2,
                              parseFloat(e.target.value),
                              "rot",
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white">
                          SCALE (X,Y,Z)
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.01"
                          value={activeDecal.scale[0]}
                          onChange={(e) =>
                            handleSliderChange(
                              0,
                              parseFloat(e.target.value),
                              "scale",
                            )
                          }
                        />
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.01"
                          value={activeDecal.scale[1]}
                          onChange={(e) =>
                            handleSliderChange(
                              1,
                              parseFloat(e.target.value),
                              "scale",
                            )
                          }
                        />
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.01"
                          value={activeDecal.scale[2]}
                          onChange={(e) =>
                            handleSliderChange(
                              2,
                              parseFloat(e.target.value),
                              "scale",
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center py-6">
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-neutral-600">
                      NO TEXT SELECTED
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isCheckoutOpen && snapshotImage && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border-t md:border border-neutral-800 w-full max-w-6xl flex flex-col md:flex-row h-[92dvh] md:h-full md:max-h-[80vh] overflow-hidden rounded-t-2xl md:rounded-xl shadow-[0_-20px_60px_rgba(0,0,0,0.8)] md:shadow-2xl">
            <div className="w-full md:w-1/2 bg-[#020202] relative p-4 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800 h-[35%] md:h-auto shrink-0">
              <button
                onClick={closeCheckout}
                className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] font-bold tracking-[0.3em] text-neutral-500 hover:text-white uppercase z-10"
              >
                ← Edit
              </button>
              <img
                src={snapshotImage}
                alt="Custom Sneaker"
                className="w-full h-full object-contain drop-shadow-2xl relative z-0"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col h-[65%] md:h-auto bg-[#0a0a0a]">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                <h2 className="font-['Anton'] text-3xl md:text-5xl text-white uppercase mb-1 md:mb-2">
                  Prototype 001
                </h2>
                <div className="text-neutral-500 text-[9px] md:text-[10px] tracking-[0.3em] font-bold mb-6 md:mb-10">
                  CUSTOM ARCHITECTURE // VERIFIED
                </div>
                <div className="space-y-3 md:space-y-4 pb-4">
                  {Object.entries(materials)
                    .filter(([zone]) => zone !== "All") // Zeigt Base Mesh auch im Checkout nicht mehr an
                    .map(([zone, mat]) => (
                      <div
                        key={zone}
                        className="flex justify-between items-center text-[9px] md:text-[10px] tracking-widest uppercase"
                      >
                        <span className="text-neutral-500">
                          {zones.find((z) => z.id === zone)?.label}
                        </span>
                        <span className="text-white flex items-center gap-2 md:gap-3">
                          <span className="text-right">{mat.name}</span>
                          <div
                            className="w-3 h-3 shrink-0 rounded-full border border-neutral-700"
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
                  {decals.length > 0 && (
                    <div className="flex justify-between items-center text-[9px] md:text-[10px] tracking-widest uppercase pt-3 md:pt-4 border-t border-neutral-900">
                      <span className="text-neutral-500">APPLIED TEXTS</span>
                      <span className="text-white">
                        {decals.map((d) => `"${d.text}"`).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="shrink-0 p-6 md:p-12 border-t border-neutral-900 bg-[#080808]">
                <div className="flex justify-between items-end mb-4 md:mb-6">
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
                    Total
                  </span>
                  <span className="font-['Anton'] text-3xl md:text-5xl text-white leading-none drop-shadow-md">
                    € {totalPrice.toFixed(2)}
                  </span>
                </div>
                <button className="w-full bg-white text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-4 md:py-6 hover:bg-neutral-300 transition-colors rounded-sm shadow-xl">
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
