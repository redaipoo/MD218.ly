"use client";

import Link from "next/link";
import { Home, ShoppingCart, Gamepad2 } from "lucide-react";
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

        {/* Xbox Button */}
        <button
          onClick={() => {
            // Check if we are on the homepage
            if (window.location.pathname === "/") {
              const el = document.getElementById("xbox-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            } else {
              window.location.href = "/#xbox-section";
            }
          }}
          className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300 text-white/50 active:text-white hover:text-white`}
        >
          <div className="relative p-2 rounded-xl transition-all duration-300 bg-[#107C10]/10 border border-[#107C10]/20 shadow-[0_0_10px_rgba(16,124,16,0.2)]">
            <Gamepad2 className="w-5 h-5 text-[#00ff00]" />
          </div>
          <span className="text-[10px] font-bold text-white/80">إكس بوكس</span>
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
