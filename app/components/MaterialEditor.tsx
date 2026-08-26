// components/MaterialEditor.tsx
"use client";

import React, { useEffect } from "react";
import {
  useConfiguratorStore,
  PREMIUM_MATERIALS,
} from "@/store/useConfiguratorStore";
import { ZONES } from "@/lib/constants";
import { triggerCapture } from "@/lib/utils";

export function MaterialEditor() {
  const {
    activeZone,
    setActiveZone,
    materials,
    setZoneMaterial,
    setColor,
    openCheckout,
  } = useConfiguratorStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeBtn = document.getElementById(`zone-btn-${activeZone}`);
      if (activeBtn)
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeZone]);

  const activeMat = materials[activeZone as keyof typeof materials];

  return (
    <div className="flex flex-col w-full">
      <div className="md:hidden flex overflow-x-auto gap-2 pb-2 mb-2 border-b border-neutral-900 custom-scrollbar scroll-smooth">
        {ZONES.map((zone) => (
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

      <div className="flex flex-col md:flex-row gap-4 xl:gap-6 w-full justify-between items-end md:items-center">
        <div className="flex flex-col w-full overflow-hidden">
          <div className="flex justify-between items-center mb-3 gap-2">
            <span className="hidden md:block text-[9px] xl:text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500">
              Material for:{" "}
              <span className="text-white">
                {ZONES.find((z) => z.id === activeZone)?.label}
              </span>
            </span>

            <div className="flex items-center justify-between md:justify-start gap-2 bg-[#0a0a0a] p-1.5 rounded-lg border border-neutral-800 w-full md:w-auto shadow-inner">
              <span className="text-[8px] xl:text-[9px] text-neutral-500 tracking-[0.2em] uppercase ml-1 md:ml-2">
                Paint
              </span>
              <div className="flex items-center">
                {/* FIX: Colorpicker-Kreis verkleinert */}
                <div className="relative w-6 h-6 md:w-7 md:h-7 rounded-full border border-neutral-700 overflow-hidden shrink-0 shadow-inner">
                  <input
                    type="color"
                    value={activeMat?.hex || "#ffffff"}
                    onChange={(e) => setColor(activeZone, e.target.value)}
                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={activeMat?.hex.toUpperCase() || ""}
                  onChange={(e) => setColor(activeZone, e.target.value)}
                  className="bg-transparent border-none py-1 font-['Space_Grotesk'] text-[9px] xl:text-[10px] tracking-widest text-white focus:outline-none w-14 xl:w-16 uppercase text-center mx-1"
                />
              </div>
            </div>
          </div>

          {/* FIX: Material-Cards sind auf Laptops jetzt md:w-20 md:h-28 (vorher h-36!) */}
          <div className="flex overflow-x-auto gap-2 xl:gap-3 pb-2 custom-scrollbar snap-x items-center">
            {PREMIUM_MATERIALS.map((mat) => (
              <button
                key={mat.name}
                onClick={() => setZoneMaterial(activeZone, mat)}
                className={`snap-center shrink-0 w-16 h-24 md:w-20 md:h-28 xl:w-24 xl:h-32 rounded-md flex flex-col items-center justify-center p-2 border border-neutral-800 transition-all ${activeMat?.name === mat.name ? "border-white bg-white/10 scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "hover:border-neutral-700 bg-[#0a0a0a]"}`}
              >
                <div
                  className="w-6 h-6 md:w-10 md:h-10 xl:w-12 xl:h-12 rounded-full border border-neutral-700 mb-2 shadow-inner"
                  style={{
                    backgroundColor: mat.hex,
                    backgroundImage: mat.textureUrl
                      ? `url(${mat.textureUrl})`
                      : "none",
                    backgroundSize: "cover",
                  }}
                />
                <span className="text-[7px] xl:text-[8px] uppercase tracking-widest text-white text-center leading-tight">
                  {mat.name}
                </span>
                {mat.priceOffset > 0 && (
                  <span className="text-[6px] xl:text-[7px] text-neutral-400 mt-1">
                    +{mat.priceOffset}€
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* FIX: Button-Padding reduziert */}
        <button
          onClick={() => triggerCapture(openCheckout)}
          className="bg-white shrink-0 text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-3 md:py-4 px-6 md:px-8 xl:py-6 xl:px-10 hover:bg-neutral-300 transition-colors w-full md:w-auto mt-2 md:mt-0 rounded-sm shadow-xl"
        >
          FINALIZE
        </button>
      </div>
    </div>
  );
}
