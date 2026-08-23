"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. BACKGROUND ZOOM & PARALLAX (Scrubbing)
      gsap.fromTo(
        imgRef.current,
        {
          scale: 1.5,
          yPercent: -20,
          filter: "brightness(0.3) grayscale(100%)",
        },
        {
          scale: 1.05, // Zoomt langsam raus
          yPercent: 20, // Bewegt sich nach unten
          filter: "brightness(0.7) grayscale(20%)", // Wird heller und bekommt etwas Farbe
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // 2. MARQUEE BACKGROUND TEXT (Bewegen sich entgegengesetzt beim Scrollen)
      gsap.to(".marquee-left", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".marquee-right", {
        xPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // 3. TEXT REVEAL: Kinetische Typografie
      gsap.fromTo(
        ".cta-word",
        { y: 200, opacity: 0, rotateZ: 5 },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%", // Feuert, wenn die Sektion etwas über der Hälfte ist
          },
        },
      );

      // 4. BUTTON SLAM: Federt aggressiv in den Screen
      gsap.fromTo(
        btnRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(2)", // Starkes Federn
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[120vh] overflow-hidden bg-black flex flex-col items-center justify-center border-t border-neutral-900"
    >
      {/* ==========================================
          BACKGROUND IMAGE 
      ========================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imgRef}
          src="/images/model_woman_3.png"
          alt="Gravity Editorial Final"
          className="w-full h-full object-cover transform-gpu"
        />
        {/* Dunkler Gradient, damit der Text immer lesbar bleibt */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* ==========================================
          MARQUEE TEXT (Hintergrund-Typografie)
      ========================================== */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center items-center pointer-events-none opacity-20 overflow-hidden">
        <h2 className="marquee-left font-['Anton'] text-[25vw] leading-[0.8] text-white whitespace-nowrap">
          ENTER THE VOID — ENTER THE VOID — ENTER THE VOID
        </h2>
        <h2
          className="marquee-right font-['Anton'] text-[25vw] leading-[0.8] text-transparent text-stroke-white whitespace-nowrap"
          style={{ WebkitTextStroke: "2px white" }}
        >
          GRAVITY ARCHITECTURE — GRAVITY ARCHITECTURE
        </h2>
      </div>

      {/* ==========================================
          VORDERGRUND: CTA CONTENT
      ========================================== */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        {/* Kinetischer Text-Aufbau */}
        <div className="flex flex-col items-center mb-16">
          <div className="overflow-hidden p-2 -my-2">
            <h2 className="cta-word font-['Anton'] text-7xl md:text-[10vw] text-white uppercase leading-[0.85] tracking-tighter">
              CONSTRUCT
            </h2>
          </div>
          <div className="overflow-hidden p-2 -my-2 flex gap-4 md:gap-8">
            <h2 className="cta-word font-['Anton'] text-7xl md:text-[10vw] text-neutral-500 uppercase leading-[0.85] tracking-tighter">
              YOUR
            </h2>
            <h2 className="cta-word font-['Anton'] text-7xl md:text-[10vw] text-white uppercase leading-[0.85] tracking-tighter">
              REALITY
            </h2>
          </div>
        </div>

        {/* Der magische Button */}
        <Link
          ref={btnRef}
          href="/configurator"
          className="group relative inline-flex items-center justify-center font-['Space_Grotesk'] bg-white text-black text-sm md:text-base font-bold tracking-[0.3em] uppercase px-16 py-8 overflow-hidden transition-transform duration-500 hover:scale-105"
        >
          {/* Hover-Effekt: Eine schwarze Box wischt von unten nach oben */}
          <span className="absolute inset-0 bg-neutral-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

          <span className="relative z-10 group-hover:text-white transition-colors duration-500">
            Initialize Configurator
          </span>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
