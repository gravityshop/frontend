"use client";

import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { ZONES } from "@/lib/constants";

export function DesktopSidebar() {
  const { editMode, activeZone, setActiveZone } = useConfiguratorStore();

  if (editMode !== "MATERIALS") return null;

  return (
    // FIX: top-[15%] anstatt top-1/2 -translate-y-1/2, damit es den Editor unten niemals berührt!
    <div className="hidden md:flex flex-col gap-0.5 absolute left-6 xl:left-12 top-[15%] pointer-events-auto conf-ui z-20 max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
      {ZONES.map((zone) => (
        <button
          key={zone.id}
          onClick={() => setActiveZone(zone.id)}
          className={`text-left text-[9px] xl:text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-4 xl:px-6 border-l-2 transition-all duration-300 ${activeZone === zone.id ? "border-white text-white bg-white/10" : "border-transparent text-neutral-500 hover:text-white"}`}
        >
          {zone.label}
        </button>
      ))}
    </div>
  );
}
