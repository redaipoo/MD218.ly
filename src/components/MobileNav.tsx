"use client";

import Link from "next/link";
import { Home, ShoppingCart, LayoutGrid } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden safe-area-bottom">
      {/* Glass background */}
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-2xl border-t border-white/10" />

      <div className="relative flex items-end justify-around px-2 pb-1 pt-1">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300 ${
            isHome ? "text-crimson-light" : "text-white/50 active:text-white"
          }`}
        >
          <div className={`p-2 rounded-xl transition-all duration-300 ${isHome ? "bg-crimson/15" : ""}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">الرئيسية</span>
          {isHome && <div className="w-1 h-1 rounded-full bg-crimson-light mt-0.5" />}
        </Link>

        {/* Center Category Button - Triggers Bottom Sheet */}
        <button
          className="relative -mt-6 group"
          onClick={() => {
            // Vibrate if supported
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(10);
            }
            const event = new CustomEvent("open-categories");
            window.dispatchEvent(event);
          }}
          aria-label="فتح الأقسام"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
          <div className="relative w-12 h-12 bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-active:scale-95 transition-all">
            <LayoutGrid className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          </div>
        </button>

        {/* Cart */}
        <button
          className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300 ${
            totalItems > 0 ? "text-crimson-light" : "text-white/50 active:text-white"
          }`}
          onClick={() => {
            const event = new CustomEvent("open-cart");
            window.dispatchEvent(event);
          }}
        >
          <div className={`relative p-2 rounded-xl transition-all duration-300 ${totalItems > 0 ? "bg-crimson/15" : ""}`}>
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-crimson text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-lg shadow-crimson/50 animate-bounce-once">
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
