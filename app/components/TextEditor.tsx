"use client";

import React, { useState } from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";

export function TextEditor() {
  const {
    decals,
    selectedDecalId,
    setSelectedDecalId,
    updateDecal,
    removeDecal,
  } = useConfiguratorStore();
  const activeDecal = decals.find((d) => d.id === selectedDecalId);
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

  return (
    <div className="flex flex-col w-full h-full">
      <style>{`
        .premium-slider { -webkit-appearance: none; width: 100%; background: transparent; min-width: 0; }
        .premium-slider::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: #ffffff; cursor: pointer; margin-top: -5px; box-shadow: 0 0 10px rgba(255,255,255,0.3); transition: transform 0.1s; }
        .premium-slider::-webkit-slider-thumb:active { transform: scale(1.2); }
        .premium-slider::-webkit-slider-runnable-track { width: 100%; height: 2px; cursor: pointer; background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
        .premium-slider:focus { outline: none; }
      `}</style>

      <div className="flex flex-col w-full">
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-2 pb-2 mb-3 border-b border-white/5 no-scrollbar md:max-h-30 md:pr-1 custom-scrollbar">
          {decals.map((decal) => (
            <div
              key={decal.id}
              className={`flex justify-between items-center px-3 py-1.5 md:px-2 md:py-2 rounded-full md:rounded border transition-colors shrink-0 w-full ${selectedDecalId === decal.id ? "border-white bg-white/10" : "border-neutral-800 bg-black"}`}
            >
              <button
                onClick={() => setSelectedDecalId(decal.id)}
                className="text-[9px] md:text-[8px] xl:text-[9px] font-bold tracking-widest text-white uppercase truncate flex-1 text-left"
              >
                {decal.text || "EMPTY"}
              </button>
              <button
                onClick={() => removeDecal(decal.id)}
                className="text-neutral-500 hover:text-red-500 text-xs md:text-[10px] ml-2 shrink-0"
              >
                ×
              </button>
            </div>
          ))}
          <div className="text-[8px] md:text-[7px] xl:text-[8px] font-bold tracking-[0.2em] text-neutral-500 uppercase px-3 py-2 md:px-1 md:py-3 border border-dashed border-neutral-800 rounded-full md:rounded shrink-0 text-center flex items-center justify-center">
            <span className="md:hidden">+ DOUBLE CLICK SHOE</span>
            <span className="hidden md:inline">+ DBL CLICK SHOE</span>
          </div>
        </div>

        {activeDecal ? (
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-3 w-full border-b border-white/5 pb-3 mb-3">
              <div className="flex flex-col w-full">
                <span className="text-[7px] xl:text-[8px] tracking-[0.2em] text-neutral-500 uppercase mb-1">
                  Text
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
                  style={{ fontSize: "16px" }}
                  className="bg-transparent border-b border-neutral-800 py-1 font-['Anton'] text-sm xl:text-base tracking-widest text-white focus:outline-none focus:border-white w-full uppercase min-w-0"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[7px] xl:text-[8px] tracking-[0.2em] text-neutral-500 uppercase">
                  Color
                </span>
                <div className="relative w-6 h-6 md:w-5 md:h-5 xl:w-6 xl:h-6 rounded-full border border-neutral-700 overflow-hidden shrink-0 shadow-inner">
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

            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full mb-3 px-1 md:px-0">
                {(["pos", "rot", "scale"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[8px] md:text-[7px] xl:text-[8px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${activeTab === tab ? "text-white border-b border-white pb-0.5" : "text-neutral-600 hover:text-neutral-400"}`}
                  >
                    {tab === "pos" ? "POS" : tab === "rot" ? "ROT" : "SCL"}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 md:gap-2">
                {(["X", "Y", "Z"] as const).map((axis, i) => (
                  <div key={axis} className="flex items-center gap-2 w-full">
                    <span className="text-[9px] md:text-[8px] font-bold text-white w-3 shrink-0">
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
                      className="premium-slider flex-1 min-w-0"
                    />
                    <span className="text-[8px] md:text-[7px] xl:text-[8px] font-mono text-neutral-500 w-6 text-right shrink-0">
                      {activeDecal[activeTab][i].toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full text-center py-6 md:py-2">
            <span className="text-[9px] md:text-[7px] xl:text-[8px] font-bold tracking-[0.2em] text-neutral-600 leading-tight block">
              NO TEXT <br className="hidden md:block" /> SELECTED
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
