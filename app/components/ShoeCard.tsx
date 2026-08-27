"use client";

import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CollectionShoe } from "@/lib/collections";

gsap.registerPlugin(ScrollTrigger);

export const ShoeCard = React.memo(
  ({
    shoe,
    index,
    onClick,
  }: {
    shoe: CollectionShoe;
    index: number;
    onClick: () => void;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    // KUGELSICHERER CACHE-CHECK:
    // Prüft nach dem Mounten, ob der Browser das Bild schon längst geladen hat
    useEffect(() => {
      if (imgRef.current && imgRef.current.complete) {
        setImgLoaded(true);
      }
    }, []);

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 90%",
              once: true,
            },
          },
        );
      }, cardRef);
      return () => ctx.revert();
    }, []);

    return (
      <div
        ref={cardRef}
        className="group cursor-pointer flex flex-col opacity-0"
        onClick={onClick}
      >
        <div
          className={`w-full aspect-4/3 bg-neutral-900 overflow-hidden relative rounded-sm shadow-2xl ${!imgLoaded ? "animate-pulse" : ""}`}
        >
          <img
            ref={imgRef}
            src={shoe.imageUrl}
            alt={shoe.name}
            // Lade die ersten 8 Bilder sofort (eager), den Rest verzögert (lazy)
            loading={index < 8 ? "eager" : "lazy"}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 ease-out" />
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="font-['Anton'] text-xl md:text-2xl uppercase tracking-wider text-white group-hover:text-neutral-300 transition-colors">
              {shoe.name}
            </h3>
            <span className="font-bold text-sm md:text-base text-white">
              € {shoe.price}.00
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-neutral-500 tracking-[0.2em] uppercase">
            {shoe.tagline}
          </p>
        </div>
      </div>
    );
  },
);

ShoeCard.displayName = "ShoeCard";
