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
      gsap.fromTo(
        imgRef.current,
        {
          scale: 1.5,
          yPercent: -20,
          filter: "brightness(0.3) grayscale(100%)",
        },
        {
          scale: 1.05,
          yPercent: 20,
          filter: "brightness(0.7) grayscale(20%)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

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
            start: "top 60%",
          },
        },
      );

      gsap.fromTo(
        btnRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(2)",
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
      // Mobile 100dvh, Desktop 120vh
      className="relative w-full h-dvh md:h-[120vh] overflow-hidden bg-black flex flex-col items-center justify-center border-t border-neutral-900"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imgRef}
          src="/images/model_woman_3.png"
          alt="Gravity Editorial Final"
          className="w-full h-full object-cover transform-gpu"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>

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

      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <div className="overflow-hidden p-2 -my-2">
            {/* Responsiver Text: text-[16vw] auf Mobile, text-[10vw] auf Desktop */}
            <h2 className="cta-word font-['Anton'] text-[16vw] md:text-[10vw] text-white uppercase leading-[0.85] tracking-tighter whitespace-nowrap">
              CONSTRUCT
            </h2>
          </div>
          <div className="overflow-hidden p-2 -my-2 flex gap-3 md:gap-8">
            <h2 className="cta-word font-['Anton'] text-[12vw] md:text-[10vw] text-neutral-500 uppercase leading-[0.85] tracking-tighter whitespace-nowrap">
              YOUR
            </h2>
            <h2 className="cta-word font-['Anton'] text-[12vw] md:text-[10vw] text-white uppercase leading-[0.85] tracking-tighter whitespace-nowrap">
              REALITY
            </h2>
          </div>
        </div>

        <Link
          ref={btnRef}
          href="/configurator"
          // Responsives Padding für den Button
          className="group relative inline-flex items-center justify-center font-['Space_Grotesk'] bg-white text-black text-xs md:text-sm font-bold tracking-[0.3em] uppercase px-8 py-5 md:px-16 md:py-8 overflow-hidden transition-transform duration-500 hover:scale-105"
        >
          <span className="absolute inset-0 bg-neutral-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

          <span className="relative z-10 group-hover:text-white transition-colors duration-500 whitespace-nowrap">
            Initialize Configurator
          </span>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
