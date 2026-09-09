"use client";

import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { ZONES } from "@/lib/constants";

export function DesktopSidebar() {
  const { editMode, activeZone, setActiveZone } = useConfiguratorStore();

  if (editMode !== "MATERIALS") return null;

  return (
    <div
      className="hidden md:flex flex-col pointer-events-none fixed z-30 conf-ui transition-all duration-500
      /* MACBOOK / TABLET: Links, aber mit strenger Höhenbegrenzung gegen Überlappung! */
      top-[20%] left-6 max-h-[50vh] overflow-y-auto pr-4 gap-1
      /* GROSSER DESKTOP (ab xl): Mehr Platz nach links, etwas größere Schrift */
      xl:left-10 xl:max-h-[60vh]
      /* Hides standard scrollbars but keeps functionality */
      [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      {ZONES.map((zone) => {
        const isActive = activeZone === zone.id;
        return (
          <button
            key={zone.id}
            onClick={() => setActiveZone(zone.id)}
            className={`pointer-events-auto text-left text-[9px] xl:text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300
              px-4 py-2.5 border-l-2
              
              ${
                isActive
                  ? "border-white bg-white/5 text-white"
                  : "border-transparent text-neutral-500 hover:text-white hover:border-white/30"
              }
            `}
          >
            {zone.label}
          </button>
        );
      })}
    </div>
  );
}
