"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const MAIN_LINKS = [
  { label: "Editions", href: "/#editions", isScroll: true },
  { label: "Archive", href: "/collections", isScroll: false },
  { label: "Configurator", href: "/configurator", isScroll: false },
];

const SECONDARY_LINKS = [
  { label: "Log In", href: "/login" },
  { label: "Imprint", href: "/imprint" },
];

export default function Navigation() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll-Listener für das Shrinking-Header-Konzept
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "expo.out", delay: 0.1 },
      );

      tl.current = gsap
        .timeline({ paused: true })
        .to(overlayRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "expo.inOut",
        })
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
        .fromTo(
          ".menu-secondary-item",
          { opacity: 0 },
          { opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" },
          "-=0.4",
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      tl.current?.play();
    } else {
      document.body.style.overflow = "auto";
      tl.current?.reverse();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]);

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
      document
        .getElementById("editions")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* HEADER: Dynamisches Padding, Frosted Glass, weicher Schatten */}
      <header
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 flex justify-between items-center text-white pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] 
        ${
          isMenuOpen
            ? "bg-transparent py-6"
            : isScrolled
              ? "py-4 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
              : "py-8 bg-transparent"
        }`}
      >
        <div className="pointer-events-auto relative z-50 flex items-center">
          <a
            href="/"
            onClick={scrollToTop}
            className="font-['Anton'] text-2xl md:text-3xl tracking-widest uppercase hover:text-neutral-400 transition-colors duration-300 cursor-pointer"
          >
            Gravity
          </a>
        </div>

        {/* DESKTOP NAV: Micro-Interactions mit Underline-Reveal */}
        <nav className="hidden md:flex font-['Space_Grotesk'] gap-10 text-xs font-bold tracking-[0.2em] uppercase pointer-events-auto">
          {MAIN_LINKS.slice(0, 2).map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.isScroll ? scrollToEditions : undefined}
              className="relative group text-neutral-300 hover:text-white transition-colors duration-300 cursor-pointer pb-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-8 pointer-events-auto font-['Space_Grotesk'] text-[6px] md:text-xs font-bold tracking-[0.2em] uppercase">
          <Link
            href="/login"
            className="relative group text-neutral-300 hover:text-white transition-colors duration-300 pb-1"
          >
            Log In
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 ease-out group-hover:w-full"></span>
          </Link>

          {/* CONFIGURE BUTTON: Awwwards Wipe Effect */}
          <Link
            href="/configurator"
            className="relative overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 transition-all duration-500 group"
          >
            <span className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></span>
            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500">
              Configure
            </span>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col justify-center items-end gap-1.5 w-8 h-8 z-50 pointer-events-auto relative group"
        >
          <span
            className={`block h-0.5 bg-white transition-all duration-500 ease-in-out ${isMenuOpen ? "w-6 rotate-45 translate-y-1" : "w-6 group-hover:w-4"}`}
          />
          <span
            className={`block h-0.5 bg-white transition-all duration-500 ease-in-out ${isMenuOpen ? "w-6 -rotate-45 -translate-y-1" : "w-4 group-hover:w-6"}`}
          />
        </button>
      </header>

      {/* OVERLAY MENU */}
      <div
        ref={overlayRef}
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
        className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-3xl flex flex-col justify-between px-6 pt-32 pb-12 font-['Space_Grotesk']"
      >
        <nav className="flex flex-col gap-6 mt-8">
          {MAIN_LINKS.map((link) => (
            <div key={link.label} className="overflow-hidden">
              <a
                href={link.href}
                onClick={
                  link.isScroll ? scrollToEditions : () => setIsMenuOpen(false)
                }
                className="menu-link-item block font-['Anton'] text-5xl uppercase tracking-wider text-neutral-400 hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            </div>
          ))}
        </nav>
        <div className="flex flex-col gap-8 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4">
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="menu-secondary-item text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors w-fit"
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
