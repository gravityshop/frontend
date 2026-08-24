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

      gsap.set(shoeEls.slice(1), { xPercent: -30, opacity: 0 });
      gsap.set(textEls.slice(1), { xPercent: -10, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=500%",
        },
      });

      shoes.forEach((_, i) => {
        if (i === 0) return;

        const label = `step${i}`;

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

        tl.to({}, { duration: 0.1 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="editions"
      ref={sectionRef}
      className="relative w-full h-dvh bg-[#050505] overflow-hidden border-b border-neutral-900 flex items-center justify-center"
    >
      {/* ==========================================
          ELEGANTER TEXT
      ========================================== */}
      {/* top-24 auf Mobile verhindert Überlappung mit der Nav */}
      <div className="absolute top-24 left-6 md:top-32 md:left-24 z-20 w-48 md:w-64 h-24">
        {shoes.map((shoe, index) => (
          <div
            key={shoe.id}
            className={`seq-text absolute top-0 left-0 w-full flex flex-col ${index === 0 ? "opacity-100" : "opacity-0"}`}
          >
            <h2 className="font-['Anton'] text-4xl md:text-5xl text-white uppercase tracking-wider">
              {shoe.name}
            </h2>
            <p className="font-['Space_Grotesk'] text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] text-neutral-500 uppercase mt-2">
              {shoe.subtitle} // 00{index + 1}
            </p>
          </div>
        ))}
      </div>

      {/* ==========================================
          DIE SCHUHE
      ========================================== */}
      {/* aspect-square auf Mobile, damit der Schuh Platz hat. mt-12 gleicht die Position aus. */}
      <div className="relative z-10 w-full max-w-5xl aspect-square md:aspect-video flex items-center justify-center mt-16 md:mt-0">
        {shoes.map((shoe, index) => (
          <img
            key={shoe.id}
            src={`/images/shoe_${shoe.id}.png`}
            alt={`Gravity Shoe ${shoe.name}`}
            // w-[90%] auf Mobile, w-[70%] auf Desktop
            className={`seq-shoe absolute w-[90%] md:w-[70%] h-auto object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] will-change-transform ${
              index === 0 ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
