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

  // Auto-Center the active zone on mobile
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
      {/* ==========================================
          MOBILE ZONES (Minimalistisch)
          ========================================== */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-4 mb-4 border-b border-white/5 no-scrollbar scroll-smooth">
        {ZONES.map((zone) => (
          <button
            key={zone.id}
            id={`zone-btn-${zone.id}`}
            onClick={() => setActiveZone(zone.id)}
            className="flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <span
              className={`whitespace-nowrap text-[9px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${activeZone === zone.id ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              {zone.label}
            </span>
            {/* Minimalistischer Dot-Indikator anstelle einer klobigen Box */}
            <span
              className={`w-1 h-1 rounded-full transition-all duration-300 ${activeZone === zone.id ? "bg-white scale-100" : "bg-transparent scale-0"}`}
            />
          </button>
        ))}
      </div>

      {/* ==========================================
          HEADER: ZONE & CUSTOM PAINT
          ========================================== */}
      <div className="flex flex-col xl:flex-row gap-6 w-full justify-between items-start xl:items-end mb-2">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-2">
            Configure
          </span>
          <span className="text-2xl md:text-3xl font-['Anton'] tracking-wider text-white uppercase leading-none">
            {ZONES.find((z) => z.id === activeZone)?.label}
          </span>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
          <span className="text-[9px] text-neutral-500 tracking-[0.2em] uppercase">
            Custom Paint
          </span>
          <div className="flex items-center gap-3 bg-[#080808] p-2 pr-4 rounded-full border border-white/10 hover:border-white/20 transition-colors">
            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-neutral-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
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
              className="bg-transparent border-none font-['Space_Grotesk'] text-[10px] md:text-xs font-bold tracking-widest text-white focus:outline-none w-16 uppercase text-right"
            />
          </div>
        </div>
      </div>

      {/* ==========================================
          MAIN EDITOR AREA (Swatches + Button)
          ========================================== */}
      <div className="flex flex-col xl:flex-row gap-8 w-full items-center justify-between border-t border-white/5 pt-4 mt-2">
        {/* SWATCHES CONTAINER 
            FIX: `pt-4 pb-6` verhindert das Abschneiden der Ränder beim Hover/Scale.
            FIX: `[&::-webkit-scrollbar]:hidden` versteckt die hässliche Scrollbar.
        */}
        <div className="flex overflow-x-auto gap-6 md:gap-10 w-full snap-x items-start pt-4 pb-6 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {PREMIUM_MATERIALS.map((mat) => {
            const isSelected = activeMat?.name === mat.name;
            return (
              <button
                key={mat.name}
                onClick={() => setZoneMaterial(activeZone, mat)}
                className="group snap-center shrink-0 flex flex-col items-center justify-start w-16 md:w-20 outline-none"
              >
                {/* 1. DER FOKUS-RING */}
                <div
                  className={`relative p-[3px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isSelected ? "scale-110" : "scale-100 group-hover:scale-105"}`}
                >
                  {/* Animierter Border */}
                  <div
                    className={`absolute inset-0 rounded-full border transition-colors duration-700 ${isSelected ? "border-white" : "border-white/5 group-hover:border-white/30"}`}
                  />

                  {/* 2. DIE KUGEL (Mit Studio-Licht Effekt) */}
                  <div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full relative overflow-hidden bg-neutral-900"
                    style={{
                      backgroundColor: mat.hex,
                      backgroundImage: mat.textureUrl
                        ? `url(${mat.textureUrl})`
                        : "none",
                      backgroundSize: "cover",
                      // Harscher innerer Schatten für plastische Tiefe
                      boxShadow:
                        "inset -4px -4px 10px rgba(0,0,0,0.6), inset 2px 2px 5px rgba(255,255,255,0.2)",
                    }}
                  >
                    {/* Fake Reflection: Simuliert eine Lichtquelle von oben links */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/60 mix-blend-overlay" />
                  </div>
                </div>

                {/* 3. DIE TYPOGRAFIE (Perfekt abgeriegelt in fester Höhe) */}
                <div className="mt-5 h-12 flex flex-col items-center justify-start w-full gap-1.5">
                  <span
                    className={`text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase text-center leading-snug transition-colors duration-500 ${isSelected ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"}`}
                  >
                    {mat.name}
                  </span>
                  {mat.priceOffset > 0 && (
                    <span
                      className={`text-[8px] font-medium tracking-[0.2em] transition-colors duration-500 ${isSelected ? "text-neutral-300" : "text-neutral-600"}`}
                    >
                      +€{mat.priceOffset}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ==========================================
            FINALIZE ACTION
            ========================================== */}
        <button
          onClick={handleFinalize}
          className="group relative overflow-hidden shrink-0 w-full xl:w-56 h-[72px] bg-white text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20 hover:border-white"
        >
          {/* Liquid Fill Hover */}
          <span className="absolute inset-0 bg-neutral-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
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
