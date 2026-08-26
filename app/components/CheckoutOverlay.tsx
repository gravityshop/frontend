// components/CheckoutOverlay.tsx
"use client";

import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { BASE_PRICE, ZONES } from "@/lib/constants";

export function CheckoutOverlay() {
  const { materials, decals, isCheckoutOpen, closeCheckout, snapshotImage } =
    useConfiguratorStore();
  const totalPrice =
    BASE_PRICE +
    Object.values(materials).reduce((acc, mat) => acc + mat.priceOffset, 0);

  if (!isCheckoutOpen || !snapshotImage) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border-t md:border border-neutral-800 w-full max-w-6xl flex flex-col md:flex-row h-[92dvh] md:h-full md:max-h-[80vh] overflow-hidden rounded-t-2xl md:rounded-xl shadow-[0_-20px_60px_rgba(0,0,0,0.8)] md:shadow-2xl">
        <div className="w-full md:w-1/2 bg-[#020202] relative p-4 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800 h-[35%] md:h-auto shrink-0">
          <button
            onClick={closeCheckout}
            className="absolute top-4 left-4 md:top-6 md:left-6 text-[10px] font-bold tracking-[0.3em] text-neutral-500 hover:text-white uppercase z-10"
          >
            ← Edit
          </button>
          <img
            src={snapshotImage}
            alt="Custom Sneaker"
            className="w-full h-full object-cover drop-shadow-2xl relative z-0"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col h-[65%] md:h-auto bg-[#0a0a0a]">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
            <h2 className="font-['Anton'] text-3xl md:text-5xl text-white uppercase mb-1 md:mb-2">
              Prototype 001
            </h2>
            <div className="text-neutral-500 text-[9px] md:text-[10px] tracking-[0.3em] font-bold mb-6 md:mb-10">
              CUSTOM ARCHITECTURE // VERIFIED
            </div>

            <div className="space-y-3 md:space-y-4 pb-4">
              {Object.entries(materials)
                .filter(([zone]) => zone !== "All")
                .map(([zone, mat]) => (
                  <div
                    key={zone}
                    className="flex justify-between items-center text-[9px] md:text-[10px] tracking-widest uppercase"
                  >
                    <span className="text-neutral-500">
                      {ZONES.find((z) => z.id === zone)?.label || zone}
                    </span>
                    <span className="text-white flex items-center gap-2 md:gap-3">
                      <span className="text-right">{mat.name}</span>
                      <div
                        className="w-3 h-3 shrink-0 rounded-full border border-neutral-700"
                        style={{
                          backgroundColor: mat.hex,
                          backgroundImage: mat.textureUrl
                            ? `url(${mat.textureUrl})`
                            : "none",
                          backgroundSize: "cover",
                        }}
                      />
                    </span>
                  </div>
                ))}
              {decals.length > 0 && (
                <div className="flex justify-between items-center text-[9px] md:text-[10px] tracking-widest uppercase pt-3 md:pt-4 border-t border-neutral-900">
                  <span className="text-neutral-500">APPLIED TEXTS</span>
                  <span className="text-white">
                    {decals.map((d) => `"${d.text}"`).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 p-6 md:p-12 border-t border-neutral-900 bg-[#080808]">
            <div className="flex justify-between items-end mb-4 md:mb-6">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
                Total
              </span>
              <span className="font-['Anton'] text-3xl md:text-5xl text-white leading-none drop-shadow-md">
                € {totalPrice.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-white text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-4 md:py-6 hover:bg-neutral-300 transition-colors rounded-sm shadow-xl">
              Authorize Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
