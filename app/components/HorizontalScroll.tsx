"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const shoes = [
  { id: 2, name: "SAND", subtitle: "Desert Utility" },
  { id: 3, name: "AMETHYST", subtitle: "Synthetic Violet" },
  { id: 4, name: "STEALTH", subtitle: "Matte Carbon" },
  { id: 5, name: "CRIMSON", subtitle: "Industrial Blood" },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const shoeEls = gsap.utils.toArray(".seq-shoe");
      const textEls = gsap.utils.toArray(".seq-text");

      // Start-Setup: Alle (außer das erste) sind leicht nach links verschoben und unsichtbar
      gsap.set(shoeEls.slice(1), { xPercent: -30, opacity: 0 });
      gsap.set(textEls.slice(1), { xPercent: -10, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1, // Weiche Verbindung zum Scrollrad (Smoothness)
          start: "top top",
          // 500% gibt uns unfassbar viel Platz, damit der Effekt weich und langsam läuft
          end: "+=500%",
        },
      });

      shoes.forEach((_, i) => {
        if (i === 0) return;

        const label = `step${i}`;

        // 1. ALTER SCHUH & TEXT gehen sanft nach RECHTS raus
        tl.to(
          shoeEls[i - 1] as HTMLElement,
          { xPercent: 30, opacity: 0, duration: 1, ease: "power2.inOut" },
          label,
        );
        tl.to(
          textEls[i - 1] as HTMLElement,
          { xPercent: 10, opacity: 0, duration: 1, ease: "power2.inOut" },
          label,
        );

        // 2. NEUER SCHUH & TEXT kommen von LINKS in die Mitte (auf 0)
        tl.to(
          shoeEls[i] as HTMLElement,
          { xPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
          label,
        );
        tl.to(
          textEls[i] as HTMLElement,
          { xPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
          label,
        );

        // 3. DAS ZÖGERN: Eine kleine Pause, bevor der nächste Slide getriggert wird
        tl.to({}, { duration: 0.1 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden border-b border-neutral-900 flex items-center justify-center"
    >
      {/* ==========================================
          ELEGANTER TEXT (Oben Links)
      ========================================== */}
      <div className="absolute top-12 left-8 md:top-24 md:left-24 z-20 w-64 h-24">
        {shoes.map((shoe, index) => (
          <div
            key={shoe.id}
            // Absolute Positionierung stapelt die Texte perfekt übereinander
            className={`seq-text absolute top-0 left-0 w-full flex flex-col ${index === 0 ? "opacity-100" : "opacity-0"}`}
          >
            <h2 className="font-['Anton'] text-4xl md:text-5xl text-white uppercase tracking-wider">
              {shoe.name}
            </h2>
            <p className="font-['Space_Grotesk'] text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase mt-2">
              {shoe.subtitle} // 00{index + 1}
            </p>
          </div>
        ))}
      </div>

      {/* ==========================================
          DIE SCHUHE (Sliden von Links nach Rechts)
      ========================================== */}
      <div className="relative z-10 w-full max-w-5xl aspect-video flex items-center justify-center">
        {shoes.map((shoe, index) => (
          <img
            key={shoe.id}
            src={`/images/shoe_${shoe.id}.png`}
            alt={`Gravity Shoe ${shoe.name}`}
            className={`seq-shoe absolute w-[85%] md:w-[70%] h-auto object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] will-change-transform ${
              index === 0 ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
