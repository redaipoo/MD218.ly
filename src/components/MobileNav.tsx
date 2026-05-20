"use client";

import Link from "next/link";
import { Home, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { assetPath } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden safe-area-bottom">
      {/* Premium glass background */}
      <div className="absolute inset-0 bg-navy-dark/95 backdrop-blur-2xl border-t border-white/[0.05] shadow-[0_-4px_30px_rgba(0,0,0,0.4)]" />
      {/* Reflective top highlight */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="relative flex items-center justify-around px-4 pb-2 pt-1.5">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all duration-300 ease-premium active:scale-95 ${
            isHome ? "text-crimson-light font-black" : "text-white/45 font-bold hover:text-white"
          }`}
        >
          <Home className={`w-5.5 h-5.5 transition-transform duration-300 ${isHome ? "scale-105" : "text-white/45"}`} />
          <span className="text-[10px] font-black">الرئيسية</span>
        </Link>

        {/* Center Logo Button - Floating & Pulsing */}
        <Link
          href="/"
          className="relative -mt-9 mb-1 z-20 group"
        >
          <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-[3px] border-navy shadow-[0_8px_24px_rgba(0,0,0,0.55),0_0_15px_rgba(220,38,38,0.2)] ring-2 ring-crimson/25 group-active:scale-95 transition-all duration-300 ease-premium animate-logo-pulse flex-shrink-0">
            <img src={assetPath("/logo.png")} alt="MD218.LY" className="w-full h-full object-cover" />
          </div>
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 -z-10 rounded-full bg-crimson/15 blur-xl scale-125 opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Cart */}
        <button
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all duration-300 ease-premium active:scale-95 relative ${
            totalItems > 0 ? "text-crimson-light font-black" : "text-white/45 font-bold hover:text-white"
          }`}
          onClick={() => {
            const event = new CustomEvent("open-cart");
            window.dispatchEvent(event);
          }}
        >
          <div className="relative">
            <ShoppingCart className={`w-5.5 h-5.5 transition-transform duration-300 ${totalItems > 0 ? "scale-105" : "text-white/45"}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-crimson text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-glow-crimson animate-bounce-once">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black">السلة</span>
        </button>
      </div>
    </nav>
  );
}
