"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { COLLECTION_DATA, CollectionShoe } from "@/lib/collections";
import { ShoeCard } from "../components/ShoeCard";
import { ProductOverlay } from "../components/ProductOverlay";
import Navigation from "../components/Navigation"; // NEU: Importiere die Main Nav

export default function CollectionsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedShoe, setSelectedShoe] = useState<CollectionShoe | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".collection-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      // NEU: pt-32 hinzugefügt, damit der Inhalt nicht hinter der festen Nav verschwindet
      className="min-h-dvh bg-[#050505] text-white font-['Space_Grotesk'] selection:bg-neutral-600 relative overflow-x-hidden pt-32"
    >
      {/* NEU: Wir nutzen das Nav-Template mit solidem Hintergrund! */}
      <Navigation variant="solid" />

      {/* Dein restlicher Code bleibt komplett unangetastet */}
      <div className="p-6 md:p-12 collection-header text-center max-w-4xl mx-auto">
        <h1 className="font-['Anton'] text-5xl md:text-8xl uppercase leading-none tracking-wider drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          CURATED DROPS
        </h1>
        <p className="mt-6 text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Pre-configured by our lead designers. Purchase directly from the
          archive or use a silhouette as the foundation for your own 3D custom
          build.
        </p>
      </div>

      <div className="px-4 md:px-12 pb-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-[1800px] mx-auto w-full mt-8">
        {COLLECTION_DATA.map((shoe, index) => (
          <ShoeCard
            key={shoe.id}
            shoe={shoe}
            index={index}
            onClick={() => setSelectedShoe(shoe)}
          />
        ))}
      </div>

      {selectedShoe && (
        <ProductOverlay
          shoe={selectedShoe}
          onClose={() => setSelectedShoe(null)}
        />
      )}
    </div>
  );
}
