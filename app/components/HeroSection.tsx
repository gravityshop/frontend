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

      // Text Reveal & Fade Out (Als Timeline!)
      const textTl = gsap.timeline({ delay: 0.5 });

      textTl
        .to(".hero-text-line", {
          y: 0,
          yPercent: 0,
          rotate: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "expo.out",
        })
        .to(
          ".hero-text-line",
          {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "+=2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-dvh overflow-hidden bg-black"
    >
      {/* 
        SENIOR FIX: CSS Hack gegen iOS Low Power Mode.
        Versteckt den nativen dicken Play-Button komplett!
      */}
      <style>{`
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none !important;
        }
        video::-webkit-media-controls {
          display: none !important;
        }
      `}</style>

      {/* 
        SENIOR FIX 2: pointer-events-none
        Verhindert, dass der User aus Versehen auf das Video tippt und die 
        nativen iOS-Controls (Vollbild etc.) aufpoppen. Es ist nur ein Hintergrund!
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          src="/video/header_hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          className="hero-video w-full h-full object-cover grayscale-20"
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4 mt-16 md:mt-20 pointer-events-none">
        <div className="overflow-hidden p-2 w-full flex justify-center">
          <h1 className="hero-text-line translate-y-[200%] rotate-[5deg] font-['Anton'] text-[12vw] md:text-[9vw] leading-[0.8] text-[#c4c3c3] text-shadow-emerald-600 uppercase tracking-tighter mix-blend-overlay whitespace-nowrap ">
            TIME LESS
          </h1>
        </div>
      </div>
    </section>
  );
}
