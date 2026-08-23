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
      // 1. MAXIMUM PARALLAX: Bild verschiebt sich nach unten & zoomt raus (Scrubbing)
      gsap.to(imgRef.current, {
        yPercent: 20, // Schiebt das Bild sanft nach unten
        scale: 1, // Zoomt das Bild auf Originalgröße zurück
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", // Wenn die Kante oben im Bildschirm erscheint
          end: "bottom top", // Bis sie wieder verschwindet
          scrub: true, // Synchronisiert exakt mit dem Mausrad
        },
      });

      // 2. TEXT REVEAL: Schlagartiges Einfliegen (Einmalig)
      gsap.fromTo(
        ".ed-text-line",
        { yPercent: 110, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%", // Löst aus, wenn der Text zu 85% sichtbar ist
          },
        },
      );

      // 3. TEXT PARALLAX: Text zieht nach oben weg (Scrubbing)
      gsap.to(textRef.current, {
        y: -150, // Zieht den Text gegen die Scroll-Richtung
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
      className="relative w-full h-max overflow-hidden bg-[#050505]"
    >
      {/* 
        Bild-Container ist 130% groß und fängt weiter oben an (-top-15%), 
        damit wir Platz haben, es nach unten zu schieben (Parallax) 
      */}
      <div className="absolute inset-0 z-0 w-full h-[135%] top-[-35%]">
        <img
          ref={imgRef}
          src="/images/models_woman_2.png"
          alt="Gravity Models Concrete Stairs"
          className="w-full h-full object-cover grayscale-30 contrast-125 scale-110"
        />
        {/* Weicher Übergang ins Schwarze oben und unten */}
        <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div
        ref={textRef}
        className="relative z-10 w-full h-full flex flex-col justify-end p-8 md:p-24 pb-32"
      >
        <div className="overflow-hidden p-2 -ml-2">
          <h6 className="ed-text-line font-['Anton'] text-[20vw] md:text-[14vw] leading-[0.8] text-white uppercase mix-blend-plus-darker">
            URBAN
          </h6>
        </div>
        <div className="overflow-hidden p-2 -ml-2">
          <h6 className="ed-text-line font-['Anton'] text-[20vw] md:text-[14vw] leading-[0.8] text-white uppercase mix-blend-difference">
            AVANT-GARDE
          </h6>
        </div>
      </div>
    </section>
  );
};

export default EditorialOne;
