// components/TextEditor.tsx
"use client";

import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { triggerCapture } from "@/lib/utils";

export function TextEditor() {
  const {
    decals,
    selectedDecalId,
    setSelectedDecalId,
    updateDecal,
    removeDecal,
    openCheckout,
  } = useConfiguratorStore();
  const activeDecal = decals.find((d) => d.id === selectedDecalId);

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
    <div className="flex flex-col w-full gap-2 md:gap-4">
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {decals.map((decal) => (
          <div
            key={decal.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors shrink-0 ${selectedDecalId === decal.id ? "border-white bg-white/10" : "border-neutral-800 bg-black"}`}
          >
            <button
              onClick={() => setSelectedDecalId(decal.id)}
              className="text-[9px] md:text-[10px] font-bold tracking-widest text-white uppercase min-w-10 text-left"
            >
              {decal.text || "EMPTY"}
            </button>
            <button
              onClick={() => removeDecal(decal.id)}
              className="text-neutral-500 hover:text-red-500 text-xs ml-2"
            >
              ×
            </button>
          </div>
        ))}
        <div className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-neutral-500 uppercase px-3 py-2 border border-dashed border-neutral-800 rounded-full shrink-0">
          + DOUBLE CLICK SHOE TO ADD TEXT
        </div>
      </div>

      {activeDecal ? (
        <>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full justify-between pb-2">
            <div className="flex items-center gap-2 md:gap-4 w-full max-w-md">
              <input
                type="text"
                value={activeDecal.text}
                onChange={(e) =>
                  updateDecal(activeDecal.id, {
                    text: e.target.value.toUpperCase().slice(0, 10),
                  })
                }
                placeholder="ENTER TEXT"
                className="bg-transparent border-b border-neutral-800 py-1 md:py-2 font-['Anton'] text-lg md:text-2xl tracking-widest text-white focus:outline-none focus:border-white w-full uppercase"
              />
              <div className="relative w-8 h-8 md:w-10 md:h-10 border border-neutral-700 overflow-hidden shrink-0 rounded-sm">
                <input
                  type="color"
                  value={activeDecal.color}
                  onChange={(e) =>
                    updateDecal(activeDecal.id, { color: e.target.value })
                  }
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={() => triggerCapture(openCheckout)}
              className="bg-white shrink-0 text-black text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase py-2 md:py-4 px-6 md:px-8 hover:bg-neutral-300 transition-colors w-full md:w-auto rounded-sm"
            >
              FINALIZE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full text-[8px] md:text-[9px] tracking-widest text-neutral-400 pt-2 md:pt-4 border-t border-neutral-900">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-white">POS (X,Y,Z)</span>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.01"
                value={activeDecal.pos[0]}
                onChange={(e) =>
                  handleSlider(0, parseFloat(e.target.value), "pos")
                }
              />
              <input
                type="range"
                min="-3"
                max="3"
                step="0.01"
                value={activeDecal.pos[1]}
                onChange={(e) =>
                  handleSlider(1, parseFloat(e.target.value), "pos")
                }
              />
              <input
                type="range"
                min="-3"
                max="3"
                step="0.01"
                value={activeDecal.pos[2]}
                onChange={(e) =>
                  handleSlider(2, parseFloat(e.target.value), "pos")
                }
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-white">ROT (X,Y,Z)</span>
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.01"
                value={activeDecal.rot[0]}
                onChange={(e) =>
                  handleSlider(0, parseFloat(e.target.value), "rot")
                }
              />
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.01"
                value={activeDecal.rot[1]}
                onChange={(e) =>
                  handleSlider(1, parseFloat(e.target.value), "rot")
                }
              />
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.01"
                value={activeDecal.rot[2]}
                onChange={(e) =>
                  handleSlider(2, parseFloat(e.target.value), "rot")
                }
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-white">SCALE (X,Y,Z)</span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={activeDecal.scale[0]}
                onChange={(e) =>
                  handleSlider(0, parseFloat(e.target.value), "scale")
                }
              />
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={activeDecal.scale[1]}
                onChange={(e) =>
                  handleSlider(1, parseFloat(e.target.value), "scale")
                }
              />
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={activeDecal.scale[2]}
                onChange={(e) =>
                  handleSlider(2, parseFloat(e.target.value), "scale")
                }
              />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full text-center py-6">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-neutral-600">
            NO TEXT SELECTED
          </span>
        </div>
      )}
    </div>
  );
}
