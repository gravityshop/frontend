"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useConfiguratorStore,
  PREMIUM_MATERIALS,
} from "@/store/useConfiguratorStore";
import { ZONES, BASE_PRICE } from "@/lib/constants";

export function MaterialEditor() {
  const router = useRouter();
  const {
    activeZone,
    setActiveZone,
    materials,
    setZoneMaterial,
    setColor,
    decals,
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
    <div className="flex flex-col w-full">
      {/* MOBILE ZONES: Vertikale Abstände radikal gekürzt */}
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

      <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 w-full justify-between items-start xl:items-end mb-1 md:mb-2">
        {/* FIX: Auf Mobile zwingen wir den Titel und den Color-Picker in EINE Flex-Row */}
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <span className="hidden md:block text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-2">
              Configure
            </span>
            <span className="text-sm md:text-3xl font-['Anton'] tracking-wider text-white uppercase leading-none">
              {ZONES.find((z) => z.id === activeZone)?.label}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden md:block text-[9px] text-neutral-500 tracking-[0.2em] uppercase">
              Custom Paint
            </span>
            {/* FIX: Color-Picker-Box für Mobile massiv verkleinert */}
            <div className="flex items-center gap-2 bg-[#080808] p-1 md:p-2 pr-2 md:pr-4 rounded-full border border-white/10 hover:border-white/20 transition-colors">
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
                className="bg-transparent border-none font-['Space_Grotesk'] text-[9px] md:text-xs font-bold tracking-widest text-white focus:outline-none w-12 md:w-16 uppercase text-right"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 w-full items-center justify-between border-t border-white/5 pt-3 md:pt-4 mt-1 md:mt-2">
        {/* SWATCHES: Container Padding reduziert, Lücken verkleinert */}
        <div className="flex overflow-x-auto gap-3 md:gap-10 w-full snap-x items-start pt-2 pb-2 md:pt-4 md:pb-6 px-1 md:px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {PREMIUM_MATERIALS.map((mat) => {
            const isSelected = activeMat?.name === mat.name;
            return (
              <button
                key={mat.name}
                onClick={() => setZoneMaterial(activeZone, mat)}
                // FIX: Container der Kacheln schmaler
                className="group snap-center shrink-0 flex flex-col items-center justify-start w-12 md:w-20 outline-none"
              >
                <div
                  className={`relative p-[2px] md:p-[3px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isSelected ? "scale-110" : "scale-100 group-hover:scale-105"}`}
                >
                  <div
                    className={`absolute inset-0 rounded-full border transition-colors duration-700 ${isSelected ? "border-white" : "border-white/5 group-hover:border-white/30"}`}
                  />

                  {/* FIX: Kugel auf Mobile winzig (w-10 h-10 anstatt w-16 h-16) */}
                  <div
                    className="w-10 h-10 md:w-16 md:h-16 rounded-full relative overflow-hidden bg-neutral-900"
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
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/60 mix-blend-overlay" />
                  </div>
                </div>

                {/* FIX: Texte rücken ultra nah ran (mt-2 statt mt-5) und Container-Höhe ist kleiner */}
                <div className="mt-2 md:mt-5 h-8 md:h-12 flex flex-col items-center justify-start w-full gap-0.5 md:gap-1.5">
                  <span
                    className={`text-[7px] md:text-[9px] font-bold tracking-[0.2em] uppercase text-center leading-[1.2] md:leading-snug transition-colors duration-500 ${isSelected ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"}`}
                  >
                    {mat.name}
                  </span>
                  {mat.priceOffset > 0 && (
                    <span
                      className={`text-[6px] md:text-[8px] font-medium tracking-[0.2em] transition-colors duration-500 ${isSelected ? "text-neutral-300" : "text-neutral-600"}`}
                    >
                      +€{mat.priceOffset}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* FIX: Button auf Mobile flacher (h-[48px] statt h-[72px]) */}
        <button
          onClick={handleFinalize}
          className="group relative overflow-hidden shrink-0 w-full xl:w-56 h-[48px] md:h-[72px] bg-white text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20 hover:border-white mt-1 md:mt-0"
        >
          <span className="absolute inset-0 bg-neutral-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          <span className="relative z-10 flex items-center justify-center gap-3 w-full h-full">
            FINALIZE
            <span className="text-[10px] transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
