"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { BASE_PRICE } from "@/lib/constants";

export function TopHeader() {
  const router = useRouter();
  const { cameraView, setCameraView, materials, decals } =
    useConfiguratorStore();

  const totalPrice =
    BASE_PRICE +
    Object.values(materials).reduce((acc, mat) => acc + mat.priceOffset, 0);

  // Die Finalize-Logik zieht jetzt global in den Header
  const handleFinalize = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      localStorage.setItem(
        "gravity_cart",
        JSON.stringify({
          mode: "CUSTOM",
          size: "42",
          customSnapshot: imgData,
          customPrice: totalPrice,
          shoe: { config: { materials, decals } },
        }),
      );
      router.push("/checkout");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-start p-6 xl:p-10 pointer-events-none z-40 conf-ui">
      {/* LINKS: Abort Button (1/3) */}
      <div className="w-1/3 flex justify-start">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-all duration-300 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>
          Abort
        </Link>
      </div>

      {/* MITTE: Main Info perfekt zentriert (1/3) */}
      <div className="w-1/3 flex flex-col items-center text-center pointer-events-auto">
        <h1 className="font-['Anton'] text-4xl xl:text-5xl text-white uppercase leading-[0.8] tracking-wider drop-shadow-2xl">
          CONFIGURE
        </h1>
        <div className="text-sm xl:text-lg text-neutral-300 font-bold tracking-widest mt-2">
          € {totalPrice.toFixed(2)}
        </div>

        {/* Kameras */}
        <div className="hidden md:flex gap-1 mt-4 text-[9px] font-bold tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md p-1 rounded border border-white/5 shadow-lg">
          {(["PROFILE", "FRONT", "HEEL", "TOP"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCameraView(view)}
              className={`px-4 py-1.5 transition-all duration-300 rounded-sm ${
                cameraView === view
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* RECHTS: FINALIZE Button (1/3) */}
      <div className="w-1/3 flex justify-end pointer-events-auto">
        <button
          onClick={handleFinalize}
          className="group relative overflow-hidden h-10 xl:h-12 w-32 md:w-40 xl:w-48 bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20 hover:border-white transition-all"
        >
          <span className="absolute inset-0 bg-neutral-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
            FINALIZE
            <span className="text-[10px] transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}
