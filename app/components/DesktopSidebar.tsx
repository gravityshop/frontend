// components/DesktopSidebar.tsx
"use client";

import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { ZONES } from "@/lib/constants";

export function DesktopSidebar() {
  const { editMode, activeZone, setActiveZone } = useConfiguratorStore();

  if (editMode !== "MATERIALS") return null;

  return (
    // FIX: max-h-[60vh], scrollbar, reduzierter Gap und z-20!
    <div className="hidden md:flex flex-col gap-1 absolute left-6 xl:left-12 top-1/2 -translate-y-1/2 pointer-events-auto conf-ui z-20 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
      {ZONES.map((zone) => (
        <button
          key={zone.id}
          onClick={() => setActiveZone(zone.id)}
          // FIX: Schriften von text-sm auf text-[9px] (bzw. xs auf Riesen-Monitoren) verkleinert
          className={`text-left text-[9px] xl:text-[11px] font-bold tracking-[0.2em] uppercase py-2 xl:py-3 px-4 xl:px-6 border-l-2 transition-all duration-300 ${activeZone === zone.id ? "border-white text-white bg-white/10" : "border-transparent text-neutral-500 hover:text-white"}`}
        >
          {zone.label}
        </button>
      ))}
    </div>
  );
}
