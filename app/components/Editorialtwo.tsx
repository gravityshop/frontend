"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EditorialTwo() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. TIMELINE FÜR DEN EINTRITT
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // Clip-Path Reveal für das Bild
      tl.fromTo(
        ".ed2-image-wrapper",
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "expo.inOut",
        },
      );

      // Bild-Zoom & Graustufen-Filter
      tl.fromTo(
        ".ed2-image",
        { scale: 1.3, filter: "grayscale(100%) contrast(1.2)" },
        {
          scale: 1,
          filter: "grayscale(20%) contrast(1.2)",
          duration: 2,
          ease: "power3.out",
        },
        "-=1.2",
      );

      // Headline Reveal (FIX: yPercent auf 140, opacity in beiden auf 1)
      tl.fromTo(
        ".ed2-headline",
        { yPercent: 140, rotate: 2, opacity: 1 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
        },
        "-=1.5",
      );

      // Paragraphen Reveal (FIX: startet bei opacity: 0, da wir es in Tailwind verstecken)
      tl.fromTo(
        ".ed2-p",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" },
        "-=1.0",
      );

      // 2. PARALLAX BEIM WEITERSCROLLEN
      gsap.to(".ed2-image", {
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
      className="w-full min-h-screen py-32 px-6 md:px-12 bg-[#050505] border-b border-neutral-900 flex items-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full max-w-screen-2xl mx-auto">
        {/* ==========================================
            ARTIKEL 1: H3 Headline & 2 Paragrafen
        ========================================== */}
        <article className="flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-12">
            {/* FIX: pt-4 px-2 pb-0 statt p-2, damit unten sauber abgeschnitten wird */}
            <div className="overflow-hidden pt-4 px-2 pb-0 -ml-2 pr-5">
              {/* FIX: opacity-0 gegen FOUC */}
              <h3 className="ed2-headline opacity-0 font-['Anton'] text-[14vw] lg:text-[7vw] leading-[0.85] uppercase text-white whitespace-nowrap">
                PHYSICAL
              </h3>
            </div>
            {/* FIX: pt-4 px-2 pb-0 statt p-2 */}
            <div className="overflow-hidden pt-4 px-2 pb-0 -ml-2 pr-5">
              {/* FIX: opacity-0 gegen FOUC */}
              <h3 className="ed2-headline opacity-0 font-['Anton'] text-[14vw] lg:text-[7vw] leading-[0.85] uppercase text-neutral-600 whitespace-nowrap">
                PRESENCE
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* FIX: opacity-0 gegen FOUC */}
            <p className="ed2-p opacity-0 font-['Space_Grotesk'] text-lg md:text-2xl text-neutral-300 leading-relaxed max-w-xl">
              An unapologetic return to tangible reality. In a digital void,
              gravity is the only truth. We engineer weight, texture, and
              stance.
            </p>
            {/* FIX: opacity-0 gegen FOUC */}
            <p className="ed2-p opacity-0 font-['Space_Grotesk'] text-sm md:text-base text-neutral-500 leading-relaxed max-w-xl pl-6 border-l-2 border-neutral-800">
              Our aesthetic is anchored in the brutalist principles of mass and
              void. The silhouette demands space. It does not ask for permission
              to exist. This is the foundation of the Gravity network.
            </p>
          </div>
        </article>

        {/* ==========================================
            ARTIKEL 2: Bild & Paragraf
        ========================================== */}
        <article className="flex flex-col gap-8 justify-center order-1 lg:order-2">
          <div className="ed2-image-wrapper relative w-full overflow-hidden bg-[#0a0a0a]">
            <img
              src="/images/modes_people.png"
              alt="Gravity Editorial - People"
              className="ed2-image w-full h-full object-cover"
            />
          </div>
          {/* FIX: opacity-0 gegen FOUC */}
          <p className="ed2-p opacity-0 font-['Space_Grotesk'] text-neutral-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase max-w-md border-t border-neutral-800 pt-6">
            Gravity Network // Grounded in the brutal reality of concrete and
            urban decay.
          </p>
        </article>
      </div>
    </section>
  );
}
