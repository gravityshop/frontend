"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. TIMELINE FÜR DEN EINTRITT (Startet beim Scrollen)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", // Startet, wenn die Sektion zu 70% im Bild ist
          toggleActions: "play none none none", // Spielt die Animation einmal ab
        },
      });

      // Brutaler Clip-Path Reveal für das Bild von unten nach oben
      tl.fromTo(
        ".manifesto-image-wrapper",
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "expo.inOut",
        },
      );

      // Bild zoomt leicht heraus
      tl.fromTo(
        ".manifesto-image",
        { scale: 1.3, filter: "grayscale(100%) contrast(1.2)" },
        {
          scale: 1,
          filter: "grayscale(20%) contrast(1.2)",
          duration: 2,
          ease: "power3.out",
        },
        "-=1.2", // Überlappt mit dem Clip-Path
      );

      // Headline slidet aus unsichtbaren Boxen hoch
      tl.fromTo(
        ".manifesto-headline",
        { yPercent: 110, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
        },
        "-=1.5",
      );

      // Paragraphen faden sanft ein
      tl.fromTo(
        ".manifesto-p",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" },
        "-=1.0",
      );

      // 2. PARALLAX BEIM WEITERSCROLLEN
      // Das Bild verschiebt sich leicht, während man weiter nach unten scrollt
      gsap.to(".manifesto-image", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="w-full min-h-screen py-32 px-6 md:px-12 bg-[#050505] border-b border-neutral-900 flex items-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full max-w-screen-2xl mx-auto">
        {/* ==========================================
            ARTIKEL 1: Bild & Paragraf
        ========================================== */}
        <article className="flex flex-col gap-8 justify-center order-2 lg:order-1">
          <div className="manifesto-image-wrapper relative w-full overflow-hidden bg-[#0a0a0a]">
            <img
              src="/images/models_woman.png"
              alt="Gravity Models - Architectural Fashion"
              className="manifesto-image w-full h-full object-cover"
            />
          </div>
          <p className="manifesto-p font-['Space_Grotesk'] text-neutral-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase max-w-md border-t border-neutral-800 pt-6">
            Architectural Footwear // Engineered for pure, unapologetic physical
            presence. We strip away the superfluous.
          </p>
        </article>

        {/* ==========================================
            ARTIKEL 2: H3 Headline & 2 Paragrafen
        ========================================== */}
        {/* ==========================================
            ARTIKEL 2: H3 Headline & 2 Paragrafen
        ========================================== */}
        <article className="flex flex-col justify-center order-1 lg:order-2">
          <div className="mb-12">
            {/* FIX: pr-8 (Padding Right) und whitespace-nowrap hinzugefügt, Font minimal verkleinert */}
            <div className="overflow-hidden p-2 -ml-11 pr-5">
              <h3 className="manifesto-headline font-['Anton'] text-[14vw] lg:text-[7vw] leading-[0.85] uppercase text-white whitespace-nowrap">
                STRUCTURAL
              </h3>
            </div>
            <div className="overflow-hidden p-2 -ml-11 pr-5">
              <h3 className="manifesto-headline font-['Anton'] text-[14vw] lg:text-[7vw] leading-[0.85] uppercase text-neutral-600 whitespace-nowrap">
                INTEGRITY
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <p className="manifesto-p font-['Space_Grotesk'] text-lg md:text-2xl text-neutral-300 leading-relaxed max-w-xl">
              We do not chase temporary aesthetics. Form over hype. Substance
              over noise. We cast monolithic silhouettes designed for the
              concrete reality.
            </p>

            <p className="manifesto-p font-['Space_Grotesk'] text-sm md:text-base text-neutral-500 leading-relaxed max-w-xl pl-6 border-l-2 border-neutral-800">
              Every seam, every layer of mesh, every millimeter of rubber is
              calculated. This is not a trend. This is a permanent shift in
              streetwear architecture. Welcome to the new weight of footwear.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
