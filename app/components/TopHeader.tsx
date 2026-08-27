"use client";

import Link from "next/link";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { BASE_PRICE } from "@/lib/constants";

export function TopHeader() {
  const { cameraView, setCameraView, materials } = useConfiguratorStore();
  const totalPrice =
    BASE_PRICE +
    Object.values(materials).reduce((acc, mat) => acc + mat.priceOffset, 0);

  return (
    <header className="flex justify-between items-start conf-ui pointer-events-auto p-4 md:p-6 xl:p-10 relative z-40">
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
        <div className="hidden md:flex gap-2 mt-4 text-[9px] font-bold tracking-[0.3em] uppercase">
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
  );
}
