"use client";

import Link from "next/link";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { BASE_PRICE } from "@/lib/constants";

export function TopHeader() {
  const { cameraView, setCameraView, materials, decals } =
    useConfiguratorStore();
  const totalPrice =
    BASE_PRICE +
    Object.values(materials).reduce((acc, mat) => acc + mat.priceOffset, 0);

  // DEV-TOOL: Kopiert die aktuellen Farben und Texte in deine Zwischenablage,
  // damit du sie leicht in lib/collections.ts einfügen kannst.
  const exportConfig = () => {
    const cleanMaterials = { ...materials };
    delete cleanMaterials["All"]; // Das Base Mesh wird gelöscht, da es ein unsichtbarer "Geist" ist.

    const configData = {
      materials: cleanMaterials,
      decals: decals,
    };

    navigator.clipboard.writeText(JSON.stringify(configData, null, 2));
    alert(
      "Copied to clipboard! You can now paste this into lib/collections.ts",
    );
  };

  return (
    // FIX: p-8 auf Desktop, xl:p-12 auf ganz großen Monitoren. Verhindert das Eindrücken des 3D Modells.
    <header className="flex justify-between items-start conf-ui pointer-events-auto p-4 md:p-8 xl:p-12 relative z-40">
      <Link
        href="/"
        className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors"
      >
        ← Abort
      </Link>

      {/* GEHEIMER EXPORT BUTTON */}
      <button
        onClick={exportConfig}
        className="absolute top-4 right-1/2 translate-x-1/2 text-[8px] border border-neutral-800 text-neutral-500 px-2 py-1 rounded hover:text-white transition-colors"
      >
        [DEV] EXPORT JSON
      </button>

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
  );
}
