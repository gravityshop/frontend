"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Background Video Reveal
      gsap.fromTo(
        ".hero-video",
        { scale: 1.2, filter: "brightness(0) contrast(1.5)" },
        {
          scale: 1,
          filter: "brightness(0.7) contrast(1.2)",
          duration: 2.5,
          ease: "power4.out",
        },
      );

      // Text Reveal
      gsap.fromTo(
        ".hero-text-line",
        { yPercent: 110, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.5,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-dvh overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0">
        <video
          src="/video/header_hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-video w-full h-full object-cover grayscale-20"
        />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4 mt-16 md:mt-20">
        {/* Haupt-Headline: M O N O L I T H */}
        <div className="overflow-hidden p-2 w-full flex justify-center">
          {/* Größen leicht reduziert (16vw auf Mobile, 12vw auf Desktop), damit das längere Wort perfekt passt */}
          <h1 className="hero-text-line font-['Anton'] text-[14vw] md:text-[6vw] leading-[0.8] text-white uppercase tracking-tighter mix-blend-overlay whitespace-nowrap">
            A B S O L U T E
          </h1>
        </div>

        {/* Subtitle */}
        <div className="overflow-hidden mt-6 md:mt-8 px-4">
          <p className="hero-text-line font-['Space_Grotesk'] text-neutral-300 text-[10px] md:text-sm lg:text-lg max-w-xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase leading-relaxed">
            Defy The Given. Form Over Hype. <br className="hidden md:block" />{" "}
            Substance Over Noise.
          </p>
        </div>
      </div>
    </section>
  );
}
