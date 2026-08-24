"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Formular-Elemente sliden weich nacheinander rein
      gsap.fromTo(
        ".auth-anim",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power3.out" },
      );

      // Das große G slidet von der Seite rein
      gsap.fromTo(
        ".auth-logo",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "expo.out", delay: 0.2 },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row selection:bg-neutral-600 selection:text-white"
    >
      {/* ==========================================
          LINKE SEITE: Branding & Zurück-Button
      ========================================== */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-24 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-900 min-h-[40vh] lg:min-h-screen">
        <Link
          href="/"
          className="auth-anim font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors w-fit"
        >
          ← Back to Gravity
        </Link>

        <div className="mt-16 lg:mt-0">
          <h1 className="auth-logo font-['Anton'] text-[25vw] lg:text-[15vw] leading-[0.8] tracking-tighter mix-blend-plus-lighter text-neutral-800">
            G.
          </h1>
          <h2 className="auth-anim font-['Anton'] text-5xl md:text-7xl mt-8 uppercase">
            Access <br /> Network
          </h2>
        </div>
      </div>

      {/* ==========================================
          RECHTE SEITE: Das Formular
      ========================================== */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-24 flex flex-col justify-center bg-[#0a0a0a]">
        <div className="max-w-md w-full mx-auto">
          <form
            className="flex flex-col gap-8"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Input: Email */}
            <div className="auth-anim flex flex-col">
              <label className="font-['Space_Grotesk'] text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="bg-transparent border-b border-neutral-800 py-4 font-['Space_Grotesk'] text-sm uppercase tracking-widest text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Input: Password */}
            <div className="auth-anim flex flex-col">
              <label className="font-['Space_Grotesk'] text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent border-b border-neutral-800 py-4 font-['Space_Grotesk'] text-sm tracking-widest text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button className="auth-anim mt-4 bg-white text-black font-['Space_Grotesk'] text-xs font-bold tracking-[0.3em] uppercase py-6 hover:bg-neutral-300 transition-colors w-full">
              Authenticate
            </button>
          </form>

          {/* Link zum Signup */}
          <div className="auth-anim mt-12 pt-8 border-t border-neutral-900 text-center">
            <p className="font-['Space_Grotesk'] text-xs text-neutral-500 tracking-widest">
              NO ACCESS YET? <br className="md:hidden" />
              <Link
                href="/signup"
                className="text-white hover:text-neutral-400 font-bold ml-2 underline underline-offset-4"
              >
                INITIALIZE IDENTITY
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
