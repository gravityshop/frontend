"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Plugin registrieren
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EditorialOne = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. MAXIMUM PARALLAX
      gsap.to(imgRef.current, {
        yPercent: 15,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. TEXT REVEAL
      gsap.fromTo(
        ".ed-text-line",
        { yPercent: 110, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.5,
          stagger: 0.15, // Etwas mehr Verzögerung für Eleganz
          ease: "expo.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
          },
        },
      );

      // 3. TEXT PARALLAX
      gsap.to(textRef.current, {
        y: -80,
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
      className="relative w-full h-dvh md:h-[120vh] overflow-hidden bg-[#050505]"
    >
      <div className="absolute inset-0 z-0 w-full h-[130%] top-[-30%]">
        <img
          ref={imgRef}
          src="/images/models_woman_2.png"
          alt="Gravity Models Concrete Stairs"
          className="w-full h-full object-cover grayscale-30 contrast-125 scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div
        ref={textRef}
        // Desktop padding optimiert (md:p-16 lg:p-24)
        className="relative z-10 w-full h-full flex flex-col justify-end p-6 md:p-16 lg:p-24 pb-16 md:pb-32"
      >
        <div className="overflow-hidden p-2 -ml-1 md:-ml-2">
          {/* Mobile bleibt riesig (22vw), Desktop wird dezent (8vw/6vw) */}
          <h6 className="ed-text-line font-['Anton'] text-[18vw] md:text-[8vw] lg:text-[6vw] leading-[0.85] md:leading-[0.9] text-white uppercase mix-blend-plus-darker whitespace-nowrap">
            URBAN
          </h6>
        </div>

        {/* Flex-Container, um auf Desktop den kleinen Subtext daneben zu setzen */}
        <div className="overflow-hidden p-2 -ml-1 md:-ml-2 flex flex-col md:flex-row md:items-end md:gap-8">
          <h6 className="ed-text-line font-['Anton'] text-[12vw] md:text-[8vw] lg:text-[6vw] leading-[0.85] md:leading-[0.9] text-white uppercase mix-blend-difference whitespace-nowrap">
            AVANT-GARDE
          </h6>

          {/* Dieser Text ist nur auf dem Desktop sichtbar und gleicht das Layout wunderschön aus */}
          <p className="ed-text-line hidden md:block font-['Space_Grotesk'] text-neutral-300 text-xs lg:text-sm tracking-[0.2em] uppercase max-w-xs md:mb-4 lg:mb-6 border-l border-neutral-600 pl-6">
            Concrete Architecture meets high-end streetwear. The silhouette
            remains absolute.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EditorialOne;
