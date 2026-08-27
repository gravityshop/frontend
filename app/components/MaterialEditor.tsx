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

  // FIX: Speichert Screenshot & Config im LocalStorage und leitet zum Checkout
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
          size: "42", // Kann der User später im Checkout oder Warenkorb ändern
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

      <div className="flex flex-col md:flex-row gap-4 w-full justify-between items-end md:items-center">
        <div className="flex flex-col w-full overflow-hidden">
          <div className="flex justify-between items-center mb-3 gap-2">
            <span className="hidden md:block text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-500">
              Material for:{" "}
              <span className="text-white">
                {ZONES.find((z) => z.id === activeZone)?.label}
              </span>
            </span>
            <div className="flex items-center justify-between md:justify-start gap-2 bg-[#0a0a0a] p-1.5 rounded-lg border border-neutral-800 w-full md:w-auto shadow-inner">
              <span className="text-[8px] text-neutral-500 tracking-[0.2em] uppercase ml-1 md:ml-2">
                Paint
              </span>
              <div className="flex items-center">
                <div className="relative w-6 h-6 rounded-full border border-neutral-700 overflow-hidden shrink-0 shadow-inner">
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
                  className="bg-transparent border-none py-1 font-['Space_Grotesk'] text-[9px] tracking-widest text-white focus:outline-none w-14 uppercase text-center mx-1"
                />
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar snap-x items-center">
            {PREMIUM_MATERIALS.map((mat) => (
              <button
                key={mat.name}
                onClick={() => setZoneMaterial(activeZone, mat)}
                // FIX: Kacheln sind nochmals geschrumpft (w-14 h-20 md:w-16 md:h-24), damit sie auf 13" Macbooks nicht stören
                className={`snap-center shrink-0 w-14 h-20 md:w-16 md:h-24 rounded-md flex flex-col items-center justify-center p-2 border border-neutral-800 transition-all ${activeMat?.name === mat.name ? "border-white bg-white/10 scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "hover:border-neutral-700 bg-[#0a0a0a]"}`}
              >
                <div
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-neutral-700 mb-2 shadow-inner"
                  style={{
                    backgroundColor: mat.hex,
                    backgroundImage: mat.textureUrl
                      ? `url(${mat.textureUrl})`
                      : "none",
                    backgroundSize: "cover",
                  }}
                />
                <span className="text-[7px] uppercase tracking-widest text-white text-center leading-tight">
                  {mat.name}
                </span>
                {mat.priceOffset > 0 && (
                  <span className="text-[6px] text-neutral-400 mt-1">
                    +{mat.priceOffset}€
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleFinalize}
          className="bg-white shrink-0 text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-3 px-6 md:py-4 md:px-8 hover:bg-neutral-300 transition-colors w-full md:w-auto mt-2 md:mt-0 rounded-sm shadow-xl"
        >
          FINALIZE
        </button>
      </div>
    </div>
  );
}
