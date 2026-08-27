"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definieren des Typs für den LocalStorage-Warenkorb
interface CartItem {
  mode: "CURATED" | "CUSTOM";
  size: string;
  shoe?: any; // Aus Collection
  customSnapshot?: string; // Aus 3D Konfigurator
  customPrice?: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  useEffect(() => {
    // Holt die Bestellung aus dem LocalStorage
    const stored = localStorage.getItem("gravity_cart");
    if (stored) {
      setCartItem(JSON.parse(stored));
    } else {
      // Wenn nichts im Warenkorb ist, zurück zur Collection
      router.push("/collections");
    }
  }, [router]);

  if (!cartItem) return null; // Ladebildschirm, solange LocalStorage geladen wird

  const isCurated = cartItem.mode === "CURATED";
  const itemName = isCurated ? cartItem.shoe.name : "CUSTOM PROTOTYPE 01";
  const itemPrice = isCurated ? cartItem.shoe.price : cartItem.customPrice;
  const itemImage = isCurated
    ? cartItem.shoe.imageUrl
    : cartItem.customSnapshot;

  return (
    <div className="min-h-dvh bg-[#050505] text-white font-['Space_Grotesk'] selection:bg-neutral-600">
      <header className="flex justify-center items-center p-6 md:p-8 border-b border-white/10 bg-[#0a0a0a]">
        <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
          GRAVITY // SECURE CHECKOUT
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row mt-8 md:mt-16 px-4 md:px-8 gap-12 pb-24">
        {/* LINKS: BESTELLÜBERSICHT */}
        <div className="w-full lg:w-1/2">
          <h2 className="font-['Anton'] text-3xl md:text-4xl uppercase tracking-wider mb-8 border-b border-white/10 pb-4">
            Order Summary
          </h2>

          <div className="flex gap-6 items-start bg-[#0a0a0a] p-6 rounded-lg border border-white/5">
            <div className="w-32 h-32 bg-black rounded-md overflow-hidden shrink-0 border border-neutral-800">
              <img
                src={itemImage}
                alt={itemName}
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="font-['Anton'] text-xl uppercase tracking-wide mb-1">
                {itemName}
              </h3>
              <p className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase mb-4">
                Size: EU {cartItem.size}
              </p>
              <div className="font-bold text-lg">€ {itemPrice}.00</div>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>€ {itemPrice}.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping (Worldwide)</span>
              <span className="text-white uppercase text-[10px] tracking-widest">
                Free
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-white font-bold text-xl">
              <span>Total</span>
              <span>€ {itemPrice}.00</span>
            </div>
          </div>
        </div>

        {/* RECHTS: ZAHLUNG */}
        <div className="w-full lg:w-1/2">
          <h2 className="font-['Anton'] text-3xl md:text-4xl uppercase tracking-wider mb-8 border-b border-white/10 pb-4">
            Payment Details
          </h2>

          <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-lg border border-white/5">
            {/* Platzhalter für Stripe Elements */}
            <div className="w-full h-48 border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-neutral-500 rounded-md mb-8 bg-black/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Stripe Payment Element (Coming Soon)
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border border-neutral-800 p-4 text-sm text-white focus:border-white focus:outline-none rounded-sm transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-transparent border border-neutral-800 p-4 text-sm text-white focus:border-white focus:outline-none rounded-sm transition-colors"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-transparent border border-neutral-800 p-4 text-sm text-white focus:border-white focus:outline-none rounded-sm transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Shipping Address"
                className="w-full bg-transparent border border-neutral-800 p-4 text-sm text-white focus:border-white focus:outline-none rounded-sm transition-colors"
              />
            </div>

            <button className="w-full bg-white text-black font-bold uppercase tracking-[0.3em] text-xs py-5 rounded-sm hover:bg-neutral-300 transition-colors shadow-xl">
              Pay € {itemPrice}.00
            </button>
            <p className="text-center text-[9px] text-neutral-600 uppercase tracking-widest mt-4">
              Secure 256-bit encrypted checkout via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
