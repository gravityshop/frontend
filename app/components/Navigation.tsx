"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP Plugin registrieren
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// 1. NAVIGATION COMPONENT
// ==========================================
const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference text-white">
      <div className="font-['Anton'] text-3xl md:text-4xl tracking-widest uppercase">
        Gravity
      </div>
      <div className="hidden md:flex gap-12 font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase">
        <Link
          href="#manifesto"
          className="hover:text-neutral-500 transition-colors"
        >
          About Us
        </Link>
        <Link
          href="#archive"
          className="hover:text-neutral-500 transition-colors"
        >
          Archive
        </Link>
        <Link
          href="#engine"
          className="hover:text-neutral-500 transition-colors"
        >
          Engine
        </Link>
      </div>
      <Link
        href="/configurator"
        className="font-['Space_Grotesk'] font-bold text-xs tracking-[0.2em] uppercase border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-500"
      >
        Start
      </Link>
    </nav>
  );
};

export default Navigation;
