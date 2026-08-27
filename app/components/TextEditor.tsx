"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { BASE_PRICE } from "@/lib/constants";

export function TextEditor() {
  const router = useRouter();
  const {
    decals,
    materials,
    selectedDecalId,
    setSelectedDecalId,
    updateDecal,
    removeDecal,
  } = useConfiguratorStore();
  const activeDecal = decals.find((d) => d.id === selectedDecalId);

  // UX Fix: Tabs, um die Slider-Höhe massiv zu reduzieren
  const [activeTab, setActiveTab] = useState<"pos" | "rot" | "scale">("pos");

  const ranges = {
    pos: { min: -3, max: 3 },
    rot: { min: -3.14, max: 3.14 },
    scale: { min: 0, max: 2 },
  };

  const handleSlider = (
    axis: 0 | 1 | 2,
    val: number,
    type: "pos" | "rot" | "scale",
  ) => {
    if (!activeDecal) return;
    const newArr = [...activeDecal[type]] as [number, number, number];
    newArr[axis] = val;
    updateDecal(activeDecal.id, { [type]: newArr });
  };

  const handleFinalize = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      const customPrice =
        BASE_PRICE +
        Object.values(materials).reduce((acc, mat) => acc + mat.priceOffset, 0);
      localStorage.setItem(
        "gravity_cart",
        JSON.stringify({
          mode: "CUSTOM",
          size: "42",
          customSnapshot: imgData,
          customPrice: customPrice,
          shoe: { config: { materials, decals } },
        }),
      );
      router.push("/checkout");
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <style>{`
        .premium-slider { -webkit-appearance: none; width: 100%; background: transparent; }
        .premium-slider::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #ffffff; cursor: pointer; margin-top: -7px; box-shadow: 0 0 10px rgba(255,255,255,0.3); transition: transform 0.1s; }
        .premium-slider::-webkit-slider-thumb:active { transform: scale(1.2); }
        .premium-slider::-webkit-slider-runnable-track { width: 100%; height: 2px; cursor: pointer; background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
        .premium-slider:focus { outline: none; }
      `}</style>

      {/* DECALS LIST */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 mb-2 border-b border-white/5 no-scrollbar">
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
          + DOUBLE CLICK SHOE
        </div>
      </div>

      {activeDecal ? (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full justify-between pb-3 border-b border-white/5 mb-3">
            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="flex flex-col w-full">
                <span className="text-[8px] tracking-[0.2em] text-neutral-500 uppercase mb-1">
                  Text Content
                </span>
                <input
                  type="text"
                  value={activeDecal.text}
                  onChange={(e) =>
                    updateDecal(activeDecal.id, {
                      text: e.target.value.toUpperCase().slice(0, 10),
                    })
                  }
                  placeholder="ENTER TEXT"
                  // FIX: Inline style `fontSize: '16px'` zwingt iOS Safari dazu, NICHT heranzuzoomen. Das ist der ultimative Hack!
                  style={{ fontSize: "16px" }}
                  className="bg-transparent border-b border-neutral-800 py-1 font-['Anton'] tracking-widest text-white focus:outline-none focus:border-white w-full uppercase"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] tracking-[0.2em] text-neutral-500 uppercase mb-1">
                  Color
                </span>
                <div className="relative w-8 h-8 rounded-full border border-neutral-700 overflow-hidden shrink-0 shadow-inner">
                  <input
                    type="color"
                    value={activeDecal.color}
                    onChange={(e) =>
                      updateDecal(activeDecal.id, { color: e.target.value })
                    }
                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleFinalize}
              className="group relative overflow-hidden shrink-0 w-full md:w-48 h-10 md:h-12 bg-white text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-white"
            >
              <span className="absolute inset-0 bg-neutral-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <span className="relative z-10 flex items-center justify-center gap-3 w-full h-full">
                FINALIZE{" "}
                <span className="text-[10px] transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
          </div>

          {/* SENIOR UX: Transform Tabs statt ewig langer Liste */}
          <div className="flex flex-col w-full">
            <div className="flex gap-6 mb-4">
              {(["pos", "rot", "scale"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${activeTab === tab ? "text-white border-b border-white pb-1" : "text-neutral-600 hover:text-neutral-400"}`}
                >
                  {tab === "pos"
                    ? "Position"
                    : tab === "rot"
                      ? "Rotation"
                      : "Scale"}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {(["X", "Y", "Z"] as const).map((axis, i) => (
                <div key={axis} className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-white w-4">
                    {axis}
                  </span>
                  <input
                    type="range"
                    min={ranges[activeTab].min}
                    max={ranges[activeTab].max}
                    step="0.01"
                    value={activeDecal[activeTab][i]}
                    onChange={(e) =>
                      handleSlider(
                        i as 0 | 1 | 2,
                        parseFloat(e.target.value),
                        activeTab,
                      )
                    }
                    className="premium-slider flex-1"
                  />
                  {/* Zeigt den aktuellen Wert sauber formatiert rechts an */}
                  <span className="text-[9px] font-mono text-neutral-500 w-8 text-right">
                    {activeDecal[activeTab][i].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full text-center py-6">
          <span className="text-[9px] md:text-xs font-bold tracking-[0.3em] text-neutral-600">
            NO TEXT SELECTED
          </span>
        </div>
      )}
    </div>
  );
}
