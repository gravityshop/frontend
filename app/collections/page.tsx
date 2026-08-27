"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { COLLECTION_DATA, CollectionShoe } from "@/lib/collections";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";

export default function CollectionsPage() {
  const router = useRouter();
  const { loadConfiguration } = useConfiguratorStore();

  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [selectedShoe, setSelectedShoe] = useState<CollectionShoe | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeError, setSizeError] = useState(false); // NEU: Fehler-State für fehlende Größe

  const SIZES = ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".collection-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
      );
      gsap.fromTo(
        ".collection-item",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.2,
        },
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (selectedShoe && overlayRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".overlay-bg",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" },
        );
        // Auf Desktop von rechts sliden, auf Mobile von unten
        const isDesktop = window.innerWidth > 768;
        gsap.fromTo(
          ".overlay-panel",
          { y: isDesktop ? 0 : "100%", x: isDesktop ? "100%" : 0 },
          { y: 0, x: 0, duration: 0.8, ease: "expo.out" },
        );
        gsap.fromTo(
          ".overlay-img",
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "expo.out", delay: 0.2 },
        );
        gsap.fromTo(
          ".stagger-el",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power3.out",
            delay: 0.3,
          },
        );
      }, overlayRef);
      return () => ctx.revert();
    }
  }, [selectedShoe]);

  const openProduct = (shoe: CollectionShoe) => {
    document.body.style.overflow = "hidden";
    setSelectedShoe(shoe);
    setSelectedSize(null);
    setShowSizeGuide(false);
    setSizeError(false);
  };

  const closeProduct = () => {
    if (overlayRef.current) {
      const isDesktop = window.innerWidth > 768;
      gsap.to(overlayRef.current.querySelector(".overlay-panel"), {
        y: isDesktop ? 0 : "100%",
        x: isDesktop ? "100%" : 0,
        duration: 0.5,
        ease: "expo.in",
      });
      gsap.to(overlayRef.current.querySelector(".overlay-bg"), {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "auto";
          setSelectedShoe(null);
        },
      });
    } else {
      document.body.style.overflow = "auto";
      setSelectedShoe(null);
    }
  };

  const handleCustomize = () => {
    if (!selectedShoe) return;
    document.body.style.overflow = "auto";
    loadConfiguration(selectedShoe.config);
    router.push("/configurator");
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedShoe) {
      // Optischer Fehler statt hässlichem Alert
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    localStorage.setItem(
      "gravity_cart",
      JSON.stringify({
        shoe: selectedShoe,
        size: selectedSize,
        mode: "CURATED",
      }),
    );
    document.body.style.overflow = "auto";
    router.push("/checkout");
  };

  const getTopMaterials = (shoe: CollectionShoe) => {
    const uniqueMats = [
      ...new Set(Object.values(shoe.config.materials).map((m) => m.name)),
    ];
    return uniqueMats
      .sort((a, b) => {
        const isAStandard =
          a.includes("PITCH BLACK") || a.includes("BONE WHITE");
        const isBStandard =
          b.includes("PITCH BLACK") || b.includes("BONE WHITE");
        if (isAStandard && !isBStandard) return 1;
        if (!isAStandard && isBStandard) return -1;
        return 0;
      })
      .slice(0, 3);
  };

  return (
    <div
      ref={pageRef}
      className="min-h-dvh bg-[#050505] text-white font-['Space_Grotesk'] selection:bg-neutral-600 relative overflow-x-hidden"
    >
      <header className="flex justify-between items-center p-6 md:p-12 border-b border-white/10 sticky top-0 bg-[#050505]/90 backdrop-blur-md z-40">
        <Link
          href="/"
          className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors"
        >
          ← HOME
        </Link>
        <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white">
          GRAVITY // ARCHIVE
        </div>
      </header>

      <div className="p-6 md:p-12 collection-header mt-8 md:mt-16 text-center max-w-4xl mx-auto">
        <h1 className="font-['Anton'] text-5xl md:text-8xl uppercase leading-none tracking-wider drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          CURATED DROPS
        </h1>
        <p className="mt-6 text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Pre-configured by our lead designers. Purchase directly from the
          archive or use a silhouette as the foundation for your own 3D custom
          build.
        </p>
      </div>

      <div className="px-4 md:px-12 pb-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-[1800px] mx-auto">
        {COLLECTION_DATA.map((shoe) => (
          <div
            key={shoe.id}
            className="collection-item group cursor-pointer flex flex-col"
            onClick={() => openProduct(shoe)}
          >
            <div className="w-full aspect-4/3 bg-neutral-900 overflow-hidden relative rounded-sm shadow-2xl">
              <img
                src={shoe.imageUrl}
                alt={shoe.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                loading="lazy"
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
        ))}
      </div>

      {/* ==========================================
          OVERLAY FIX: Desktop nun bildschirmfüllend!
          ========================================== */}
      {selectedShoe && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-end md:items-stretch justify-end p-0 pointer-events-auto"
        >
          <div
            className="overlay-bg absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={closeProduct}
          ></div>

          {/* Panel zieht sich auf Desktop jetzt über die volle Höhe und rechte Seite */}
          <div className="overlay-panel bg-[#0a0a0a] w-full md:w-screen h-dvh flex flex-col md:flex-row relative z-10">
            <button
              onClick={closeProduct}
              className="absolute top-4 left-4 md:top-8 md:left-8 z-50 text-[10px] font-bold tracking-[0.3em] text-neutral-500 hover:text-white uppercase bg-black/60 px-4 py-2 rounded-full backdrop-blur-md transition-colors hover:bg-black/80 group"
            >
              <span className="md:hidden">✕</span>
              <span className="hidden md:inline group-hover:-translate-x-1 transition-transform">
                ← CLOSE
              </span>
            </button>

            {/* LINKS: BILD - Jetzt auf Desktop riesig und Full-Cover */}
            <div className="w-full md:w-[55%] h-[35vh] md:h-full bg-black relative flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-900 overflow-hidden">
              <img
                src={selectedShoe.imageUrl}
                alt={selectedShoe.name}
                className="overlay-img w-full h-full object-cover opacity-90"
              />
            </div>

            {/* RECHTS: CONTENT - Breiter und größere Schriften */}
            <div className="w-full md:w-[45%] flex flex-col h-[65vh] md:h-full bg-[#0a0a0a] relative overflow-hidden">
              <div
                className={`absolute inset-0 z-20 bg-[#0a0a0a] p-6 md:p-16 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showSizeGuide ? "translate-x-0" : "translate-x-full"}`}
              >
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <h3 className="font-['Anton'] text-3xl uppercase">
                    Size Guide
                  </h3>
                  <button
                    onClick={() => setShowSizeGuide(false)}
                    className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 hover:text-white"
                  >
                    ✕ CLOSE
                  </button>
                </div>
                <div className="overflow-y-auto text-xs text-neutral-300 space-y-0 border border-white/10 rounded-lg">
                  <div className="grid grid-cols-4 bg-white/5 p-3 font-bold tracking-widest text-[9px] uppercase text-neutral-500">
                    <span>EU</span>
                    <span>US (M)</span>
                    <span>UK</span>
                    <span>CM</span>
                  </div>
                  {[
                    { eu: "38", us: "6", uk: "5.5", cm: "24" },
                    { eu: "39", us: "6.5", uk: "6", cm: "24.5" },
                    { eu: "40", us: "7", uk: "6.5", cm: "25" },
                    { eu: "41", us: "8", uk: "7.5", cm: "26" },
                    { eu: "42", us: "8.5", uk: "8", cm: "26.5" },
                    { eu: "43", us: "9.5", uk: "9", cm: "27.5" },
                    { eu: "44", us: "10", uk: "9.5", cm: "28" },
                    { eu: "45", us: "11", uk: "10.5", cm: "29" },
                    { eu: "46", us: "12", uk: "11", cm: "30" },
                    { eu: "47", us: "12.5", uk: "11.5", cm: "30.5" },
                  ].map((s) => (
                    <div
                      key={s.eu}
                      className="grid grid-cols-4 p-3 border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <span className="font-bold text-white">{s.eu}</span>
                      <span>{s.us}</span>
                      <span>{s.uk}</span>
                      <span>{s.cm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-16">
                <div className="stagger-el mb-4 text-xs md:text-sm text-neutral-500 tracking-[0.3em] font-bold uppercase">
                  GRAVITY // SERIES 01
                </div>

                {/* Auf Desktop jetzt richtig groß! */}
                <h2 className="stagger-el font-['Anton'] text-4xl md:text-7xl uppercase leading-none tracking-wider mb-4 text-white">
                  {selectedShoe.name}
                </h2>

                <div className="stagger-el text-2xl md:text-3xl font-bold mb-8 text-white">
                  € {selectedShoe.price}.00
                </div>

                <p className="stagger-el text-sm md:text-base text-neutral-400 leading-relaxed mb-12">
                  {selectedShoe.story}
                </p>

                <div className="stagger-el grid grid-cols-2 gap-6 mb-12 text-[10px] md:text-xs uppercase tracking-widest text-neutral-400 border-t border-white/10 pt-8">
                  <div>
                    <span className="block text-white font-bold mb-2">
                      Origin
                    </span>
                    Handcrafted in Portugal
                  </div>
                  <div>
                    <span className="block text-white font-bold mb-2">
                      Upper
                    </span>
                    Premium Italian Leather
                  </div>
                  <div>
                    <span className="block text-white font-bold mb-2">
                      Lining
                    </span>
                    Breathable Organic Cotton
                  </div>
                  <div>
                    <span className="block text-white font-bold mb-2">
                      Sole
                    </span>
                    Custom TPR Rubber
                  </div>
                </div>

                <div className="stagger-el mb-12 p-6 border border-white/5 bg-white/5 rounded-sm">
                  <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4">
                    Material DNA
                  </div>
                  <ul className="text-sm md:text-base text-neutral-300 space-y-3">
                    {getTopMaterials(selectedShoe).map((matName, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <span className="w-2 h-2 bg-neutral-500 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></span>
                        {matName}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="stagger-el mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white">
                      Select Size (EU)
                      {/* Rote Fehlermeldung, wenn keine Größe gewählt wurde */}
                      {sizeError && (
                        <span className="ml-4 text-red-500 animate-pulse">
                          Required!
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-[10px] md:text-xs font-bold tracking-widest text-neutral-500 underline hover:text-white transition-colors"
                    >
                      SIZE GUIDE
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`py-4 text-sm font-bold border rounded-sm transition-all duration-300 ${selectedSize === size ? "bg-white text-black border-white scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)]" : sizeError ? "border-red-900/50 text-neutral-500 hover:border-red-500" : "border-neutral-800 text-neutral-400 hover:border-neutral-500 hover:bg-white/5"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="stagger-el shrink-0 p-6 md:p-10 border-t border-neutral-900 bg-[#080808]">
                <div className="flex flex-col xl:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="group relative overflow-hidden flex-1 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase py-6 rounded-sm shadow-xl"
                  >
                    <span className="absolute inset-0 bg-neutral-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <span className="relative z-10">ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleCustomize}
                    className="group relative overflow-hidden flex-1 border border-neutral-700 text-white text-xs font-bold tracking-[0.3em] uppercase py-6 rounded-sm"
                  >
                    <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                      CUSTOMIZE IN 3D
                    </span>
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-neutral-500 tracking-widest uppercase">
                  <span>⏱ Made to Order</span>
                  <span className="text-neutral-800">//</span>
                  <span>Ships in 14-21 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
