"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { yPercent: -100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
          delay: 0.2,
        },
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Custom Scroll-Funktion, um weich nach ganz oben zu sliden
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Verhindert das Standard-Verhalten, falls wir auf der Startseite sind
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToEditions = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById("editions");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-12 md:py-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none"
    >
      {/* 1. LOGO (Scrollt weich nach oben) */}
      <div className="pointer-events-auto">
        <a
          href="/"
          onClick={scrollToTop}
          className="font-['Anton'] text-2xl md:text-4xl tracking-widest uppercase hover:opacity-70 transition-opacity cursor-pointer"
        >
          Gravity
        </a>
      </div>

      {/* 2. MAIN LINK (Verlinkt zur HorizontalScroll Section) */}
      <nav className="hidden md:flex font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase pointer-events-auto">
        <a
          href="/#editions"
          onClick={scrollToEditions}
          className="hover:text-neutral-500 transition-colors cursor-pointer"
        >
          Editions
        </a>
      </nav>

      {/* 3. USER AREA & CTA */}
      <div className="flex items-center gap-4 md:gap-6 pointer-events-auto font-['Space_Grotesk'] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
        <Link
          href="/login"
          className="hidden md:block hover:text-neutral-500 transition-colors"
        >
          Log In
        </Link>
        <Link
          href="/configurator"
          className="border border-white px-4 py-2 md:px-6 md:py-3 hover:bg-white hover:text-black transition-colors duration-500 whitespace-nowrap"
        >
          Configure
        </Link>
      </div>
    </header>
  );
}
