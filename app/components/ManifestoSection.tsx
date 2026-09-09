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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ".manifesto-image-wrapper",
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "expo.inOut",
        },
      );

      tl.fromTo(
        ".manifesto-image",
        { scale: 1.3, filter: "grayscale(100%) contrast(1.2)" },
        {
          scale: 1,
          filter: "grayscale(20%) contrast(1.2)",
          duration: 2,
          ease: "power3.out",
        },
        "-=1.2",
      );

      tl.to(
        ".manifesto-headline",
        {
          y: 0,
          yPercent: 0,
          rotate: 0,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
        },
        "-=1.5",
      );

      tl.fromTo(
        ".manifesto-p",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" },
        "-=1.0",
      );

      gsap.to(".manifesto-image", {
        yPercent: 10, // Leicht reduziert für Mobile
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
      // Padding reduziert für Mobile (py-24 px-6)
      className="w-full min-h-screen py-24 md:py-32 px-6 md:px-12 bg-[#050505] border-b border-neutral-900 flex items-center"
    >
      {/* gap-12 statt gap-24 für Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full max-w-screen-2xl mx-auto">
        <article className="flex flex-col gap-6 md:gap-8 justify-center order-2 lg:order-1">
          <div className="manifesto-image-wrapper relative w-full overflow-hidden bg-[#0a0a0a]">
            <img
              src="/images/models_woman.png"
              alt="Gravity Models - Architectural Fashion"
              className="manifesto-image w-full h-full object-cover"
            />
          </div>
          <p className="manifesto-p font-['Space_Grotesk'] text-neutral-400 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase max-w-md border-t border-neutral-800 pt-6">
            Architectural Footwear // Engineered for pure, unapologetic physical
            presence. We strip away the superfluous.
          </p>
        </article>

        <article className="flex flex-col justify-center order-1 lg:order-2">
          <div className="mb-8 md:mb-12">
            <div className="overflow-hidden p-2 -ml-2 md:-ml-11 pr-52 md:pr-5">
              <h3 className="manifesto-headline translate-y-[200%] rotate-[5deg] font-['Anton'] text-[13vw] md:text-[12vw] lg:text-[7vw] leading-[0.85] uppercase text-white whitespace-nowrap">
                STRUCTURAL
              </h3>
            </div>
            <div className="overflow-hidden p-2 -ml-2 md:-ml-11 pr-52 md:pr-5">
              <h3 className="manifesto-headline translate-y-[200%] rotate-[5deg] font-['Anton'] text-[15vw] md:text-[12vw] lg:text-[7vw] leading-[0.85] uppercase text-neutral-600 whitespace-nowrap">
                INTEGRITY
              </h3>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
