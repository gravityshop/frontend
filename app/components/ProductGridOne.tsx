"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      gsap.fromTo(
        ".pg1-element",
        { y: 40, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: textContainerRef.current,
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        shoeRef.current,
        { scale: 0.8, opacity: 0, rotation: -5, y: 50 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          y: 0,
          duration: 1.2,
          ease: "back.out(1.2)",
          scrollTrigger: { trigger: shoeRef.current, start: "top 85%" },
        },
      );

      gsap.to(shoeRef.current, {
        y: -30, // Parallax auf Mobile etwas sanfter
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 50,
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
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Padding optimiert: p-8 md:p-16 lg:p-24 */}
        <div
          ref={textContainerRef}
          className="p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-neutral-900"
        >
          <div className="overflow-hidden mb-4 p-1">
            <div className="pg1-element font-['Space_Grotesk'] text-neutral-500 font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase">
              BEST SELLER
            </div>
          </div>

          <div className="overflow-hidden mb-6 md:mb-8 p-1 -ml-1">
            {/* Schriftgröße auf Mobile text-5xl, auf Desktop text-7xl */}
            <h2 className="pg1-element font-['Anton'] text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-[1.1]">
              The Foundation
            </h2>
          </div>

          <div className="overflow-hidden mb-8 md:mb-12 p-1">
            <p className="pg1-element font-['Space_Grotesk'] text-neutral-400 text-sm md:text-lg leading-relaxed max-w-md">
              Thick sculpted midsole. Layered matte leather and porous mesh.
              Designed for the intersection of high-end streetwear and brutalist
              architecture.
            </p>
          </div>

          <div className="overflow-hidden p-1">
            <Link
              href="/configurator"
              className="pg1-element inline-flex w-fit font-['Space_Grotesk'] text-white border-b border-neutral-700 pb-2 hover:text-neutral-400 hover:border-neutral-400 transition-all duration-300 uppercase tracking-[0.2em] font-bold text-[10px] md:text-sm"
            >
              Configure Model
            </Link>
          </div>
        </div>

        {/* Höhe auf Mobile h-[50vh] für eine saubere Darstellung */}
        <div className="relative overflow-hidden h-[50vh] md:h-[60vh] lg:h-auto bg-[#0a0a0a] flex items-center justify-center p-8 md:p-12 lg:p-24 group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <img
            ref={shoeRef}
            src="/images/shoe_8.png"
            alt="Gravity Archive 001 Sneaker"
            // w-[90%] md:w-full verhindert, dass der Schuh an den Seiten abgeschnitten wird
            className="relative z-10 w-[90%] md:w-full h-full object-contain filter contrast-125 grayscale-10 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductGridOne;
