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
      <div className="absolute inset-0 bg-navy-dark/85 backdrop-blur-2xl border-t border-white/[0.06]" />
      {/* Reflective top highlight */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative flex items-end justify-around px-2 pb-1 pt-1">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300 ease-premium ${
            isHome ? "text-crimson-light" : "text-white/40 active:text-white"
          }`}
        >
          <div className={`p-2 rounded-xl transition-all duration-300 ease-premium ${isHome ? "bg-crimson/10 shadow-[0_0_12px_rgba(139,26,26,0.15)]" : ""}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">{isHome ? "الرئيسية" : "الرئيسية"}</span>
          {isHome && <div className="w-1 h-1 rounded-full bg-crimson-light mt-0.5" />}
        </Link>

        {/* Center Logo Button */}
        <Link
          href="/"
          className="relative -mt-8 group"
        >
          <div className="relative w-[58px] h-[58px] rounded-full overflow-hidden border-[3px] border-navy-dark shadow-premium ring-2 ring-crimson/15 group-hover:ring-crimson/30 group-active:scale-95 transition-all duration-300 ease-premium">
            <img src={assetPath("/logo.png")} alt="MD218.LY" className="w-full h-full object-cover" />
          </div>
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 -z-10 rounded-full bg-crimson/10 blur-lg scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Cart */}
        <button
          className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300 ease-premium ${
            totalItems > 0 ? "text-crimson-light" : "text-white/40 active:text-white"
          }`}
          onClick={() => {
            const event = new CustomEvent("open-cart");
            window.dispatchEvent(event);
          }}
        >
          <div className={`relative p-2 rounded-xl transition-all duration-300 ease-premium ${totalItems > 0 ? "bg-crimson/10 shadow-[0_0_12px_rgba(139,26,26,0.15)]" : ""}`}>
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-crimson text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-glow-crimson animate-bounce-once">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">السلة</span>
          {totalItems > 0 && <div className="w-1 h-1 rounded-full bg-crimson-light mt-0.5" />}
        </button>
      </div>
    </nav>
  );
}
