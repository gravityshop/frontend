"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP Plugin registrieren
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ProductGridOne = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shoeRef = useRef<HTMLImageElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. TEXT REVEAL: Alles, was die Klasse "pg1-element" hat, slidet nacheinander hoch
      gsap.fromTo(
        ".pg1-element",
        { y: 60, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.2,
          stagger: 0.15, // Verzögerung zwischen den einzelnen Zeilen
          ease: "power4.out",
          scrollTrigger: {
            trigger: textContainerRef.current,
            start: "top 75%", // Löst aus, wenn der Textblock zu 75% im Bild ist
          },
        },
      );

      // 2. SHOE IMPACT REVEAL: Der Schuh federt extrem physisch in den Screen
      gsap.fromTo(
        shoeRef.current,
        { scale: 0.7, opacity: 0, rotation: -20, y: 100 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          y: 0,
          duration: 1.5,
          ease: "back.out(1.5)", // Dieses "Back-Ease" gibt das schwere physikalische Gefühl
          scrollTrigger: {
            trigger: shoeRef.current,
            start: "top 80%",
          },
        },
      );

      // 3. SHOE PARALLAX FLOAT: Beim Weiterscrollen zieht der Schuh nach oben
      gsap.to(shoeRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 4, // Weicher Scrub für das Scrollrad
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="w-full bg-[#050505] border-y border-neutral-900 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        {/* ==========================================
            LINKE SEITE: Text & CTA
        ========================================== */}
        <div
          ref={textContainerRef}
          className="p-12 md:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-neutral-900"
        >
          {/* Jedes Element braucht einen Overflow-Container für den sauberen Cut-Effekt */}
          <div className="overflow-hidden mb-4 p-1">
            <div className="pg1-element font-['Space_Grotesk'] text-neutral-500 font-bold tracking-[0.2em] uppercase">
              BEST SELLER
            </div>
          </div>

          <div className="overflow-hidden mb-8 p-1 -ml-1">
            <h2 className="pg1-element font-['Anton'] text-6xl md:text-8xl text-white uppercase leading-none">
              The Foundation
            </h2>
          </div>

          <div className="overflow-hidden mb-12 p-1">
            <p className="pg1-element font-['Space_Grotesk'] text-neutral-400 text-lg md:text-xl leading-relaxed max-w-md">
              Thick sculpted midsole. Layered matte leather and porous mesh.
              Designed for the intersection of high-end streetwear and brutalist
              architecture.
            </p>
          </div>

          <div className="overflow-hidden p-1">
            <Link
              href="/configurator"
              className="pg1-element inline-flex w-fit font-['Space_Grotesk'] text-white border-b border-neutral-700 pb-2 hover:text-neutral-400 hover:border-neutral-400 transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm"
            >
              Configure Model
            </Link>
          </div>
        </div>

        {/* ==========================================
            RECHTE SEITE: Schuh Bild
        ========================================== */}
        <div className="relative overflow-hidden h-[80vh] lg:h-auto bg-[#0a0a0a] flex items-center justify-center p-12 lg:p-24 group">
          {/* Ein subtiler Hintergrund-Glow, der die Silhouette betont */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <img
            ref={shoeRef}
            src="/images/shoe_8.png"
            alt="Gravity Archive 001 Sneaker"
            // Filter korrigiert: grayscale-[10%] ist die korrekte Tailwind-Syntax
            className="relative z-10 w-full h-full object-cover filter contrast-125 grayscale-10 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductGridOne;
