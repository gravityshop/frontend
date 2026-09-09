"use client";

import React, { useEffect } from "react";
import {
  useConfiguratorStore,
  PREMIUM_MATERIALS,
} from "@/store/useConfiguratorStore";
import { ZONES } from "@/lib/constants";

export function MaterialEditor() {
  const { activeZone, setActiveZone, materials, setZoneMaterial, setColor } =
    useConfiguratorStore();

  useEffect(() => {
    if (window.innerWidth < 768) {
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
    }
  }, [activeZone]);

  const activeMat = materials[activeZone as keyof typeof materials];

  return (
    <div className="flex flex-col w-full">
      {/* MOBILE ZONES */}
      <div className="md:hidden flex overflow-x-auto gap-3 pb-2 mb-2 border-b border-white/5 no-scrollbar scroll-smooth">
        {ZONES.map((zone) => (
          <button
            key={zone.id}
            id={`zone-btn-${zone.id}`}
            onClick={() => setActiveZone(zone.id)}
            className="flex flex-col items-center gap-1 focus:outline-none shrink-0"
          >
            <span
              className={`whitespace-nowrap text-[8px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${activeZone === zone.id ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              {zone.label}
            </span>
            <span
              className={`w-1 h-1 rounded-full transition-all duration-300 ${activeZone === zone.id ? "bg-white scale-100" : "bg-transparent scale-0"}`}
            />
          </button>
        ))}
      </div>

      {/* HEADER: Titel & Color Picker */}
      <div className="flex flex-col w-full mb-1 md:mb-4 border-b border-white/5 pb-3">
        <div className="flex flex-row md:flex-col w-full justify-between md:justify-center items-center md:gap-3">
          <div className="flex flex-col md:items-center text-left md:text-center">
            <span className="hidden md:block text-[8px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-1">
              Zone
            </span>
            <span className="text-sm md:text-lg xl:text-xl font-['Anton'] tracking-wider text-white uppercase leading-none wrap-break-word">
              {ZONES.find((z) => z.id === activeZone)?.label}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-[#080808] p-1 md:p-1.5 md:pr-3 rounded-full border border-white/10 hover:border-white/30 transition-colors">
              <div className="relative w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden shrink-0 border border-neutral-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
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
                className="bg-transparent border-none font-['Space_Grotesk'] text-[9px] font-bold tracking-widest text-white focus:outline-none w-12 md:w-14 uppercase text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SWATCHES */}
      <div className="flex flex-col w-full items-center justify-between">
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-3 md:gap-5 w-full snap-x md:snap-none items-start md:items-center pt-2 pb-2 md:pt-2 md:pb-6 px-1 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {PREMIUM_MATERIALS.map((mat) => {
            const isSelected = activeMat?.name === mat.name;
            return (
              <button
                key={mat.name}
                onClick={() => setZoneMaterial(activeZone, mat)}
                className="group snap-center shrink-0 flex flex-col items-center justify-start w-12 md:w-full outline-none"
              >
                <div
                  className={`relative p-0.5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isSelected ? "scale-110 md:scale-125" : "scale-100 group-hover:scale-110"}`}
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-colors duration-700 ${isSelected ? "border-white" : "border-white/5 group-hover:border-white/30"}`}
                  />
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-full relative overflow-hidden bg-neutral-900"
                    style={{
                      backgroundColor: mat.hex,
                      backgroundImage: mat.textureUrl
                        ? `url(${mat.textureUrl})`
                        : "none",
                      backgroundSize: "cover",
                      boxShadow:
                        "inset -4px -4px 10px rgba(0,0,0,0.6), inset 2px 2px 5px rgba(255,255,255,0.2)",
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-black/60 mix-blend-overlay" />
                  </div>
                </div>
                <div className="mt-2 md:mt-3 flex flex-col items-center justify-start w-full gap-0.5 md:gap-1">
                  <span
                    className={`text-[7px] md:text-[8px] font-bold tracking-[0.2em] uppercase text-center leading-[1.2] md:leading-snug transition-colors duration-500 ${isSelected ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"}`}
                  >
                    {mat.name}
                  </span>
                  {mat.priceOffset > 0 && (
                    <span
                      className={`text-[6px] md:text-[7px] font-medium tracking-[0.2em] transition-colors duration-500 ${isSelected ? "text-neutral-300" : "text-neutral-600"}`}
                    >
                      +€{mat.priceOffset}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
