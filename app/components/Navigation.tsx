"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";

// ==========================================
// ZENTRALE LINK-VERWALTUNG
// ==========================================
const MAIN_LINKS = [
  { label: "Editions", href: "/#editions", isScroll: true },
  { label: "Archive", href: "/collections", isScroll: false },
  { label: "Configurator", href: "/configurator", isScroll: false },
];

const SECONDARY_LINKS = [
  { label: "Log In", href: "/login" },
  { label: "Imprint", href: "/imprint" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Navigation() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ==========================================
  // GSAP INITIAL ANIMATION & TIMELINE SETUP
  // ==========================================
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initialer Header Fade-In
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

      // 2. Setup für die Mobile Menu Timeline (standardmäßig pausiert)
      tl.current = gsap
        .timeline({ paused: true })
        // Clip-Path Reveal von oben nach unten
        .to(overlayRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "expo.inOut",
        })
        // Links fliegen nacheinander ein
        .fromTo(
          ".menu-link-item",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        // Secondary Links (Legal, Login) faden ein
        .fromTo(
          ".menu-secondary-item",
          { opacity: 0 },
          { opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" },
          "-=0.4",
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // ==========================================
  // MENU TOGGLE LOGIK (Play/Reverse & Scroll Lock)
  // ==========================================
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // Scrollen im Hintergrund blockieren
      tl.current?.play();
    } else {
      document.body.style.overflow = "auto";
      tl.current?.reverse();
    }
  }, [isMenuOpen]);

  // Schließt das Menü automatisch, wenn sich die Route ändert
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]);

  // ==========================================
  // SCROLL HELPER
  // ==========================================
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const scrollToEditions = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById("editions");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <>
      <header
        ref={navRef}
        // WICHTIG: mix-blend-difference wird deaktiviert, wenn das Menü offen ist, damit es nicht unsichtbar wird!
        className={`fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center text-white pointer-events-none transition-all duration-500 ${isMenuOpen ? "" : "mix-blend-difference"}`}
      >
        {/* 1. LOGO */}
        <div className="pointer-events-auto relative z-50">
          <a
            href="/"
            onClick={scrollToTop}
            className="font-['Anton'] text-2xl md:text-3xl tracking-widest uppercase hover:opacity-70 transition-opacity cursor-pointer"
          >
            Gravity
          </a>
        </div>

        {/* 2. DESKTOP NAVIGATION */}
        <nav className="hidden md:flex font-['Space_Grotesk'] gap-10 text-xs font-bold tracking-[0.2em] uppercase pointer-events-auto">
          {MAIN_LINKS.slice(0, 2).map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.isScroll ? scrollToEditions : undefined}
              className="hover:text-neutral-500 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* 3. DESKTOP CTA & USER AREA */}
        <div className="hidden md:flex items-center gap-6 pointer-events-auto font-['Space_Grotesk'] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
          <Link
            href="/login"
            className="hover:text-neutral-500 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/configurator"
            className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors duration-500 whitespace-nowrap"
          >
            Configure
          </Link>
        </div>

        {/* 4. MOBILE BURGER BUTTON (Kinetische Animation) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col justify-center items-end gap-1.5 w-8 h-8 z-50 pointer-events-auto relative group"
          aria-label="Toggle Menu"
        >
          <span
            className={`block h-0.5 bg-white transition-all duration-500 ease-in-out ${isMenuOpen ? "w-6 rotate-45 translate-y-1" : "w-6 group-hover:w-4"}`}
          />
          <span
            className={`block h-0.5 bg-white transition-all duration-500 ease-in-out ${isMenuOpen ? "w-6 -rotate-45 -translate-y-1" : "w-4 group-hover:w-6"}`}
          />
        </button>
      </header>

      {/* ==========================================
          MOBILE MENU FULLSCREEN OVERLAY
          ========================================== */}
      <div
        ref={overlayRef}
        // clipPath startet bei 0 Höhe und wird durch GSAP nach unten aufgezogen
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
        className="fixed inset-0 z-40 bg-[#050505] flex flex-col justify-between px-6 pt-32 pb-12 font-['Space_Grotesk']"
      >
        {/* MAIN LINKS */}
        <nav className="flex flex-col gap-6 mt-8">
          {MAIN_LINKS.map((link) => (
            <div key={link.label} className="overflow-hidden">
              <a
                href={link.href}
                onClick={
                  link.isScroll ? scrollToEditions : () => setIsMenuOpen(false)
                }
                className="menu-link-item block font-['Anton'] text-5xl uppercase tracking-wider text-white hover:text-neutral-500 transition-colors"
              >
                {link.label}
              </a>
            </div>
          ))}
        </nav>

        {/* SECONDARY LINKS & LEGAL */}
        <div className="flex flex-col gap-8 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4">
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="menu-secondary-item text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="menu-secondary-item text-[9px] tracking-widest uppercase text-neutral-600">
            © {new Date().getFullYear()} GRAVITY. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
