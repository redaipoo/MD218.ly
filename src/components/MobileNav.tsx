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

  const scrollToXbox = () => {
    if (!isHome) {
      window.location.href = "/#xbox-section";
      return;
    }
    const el = document.getElementById("xbox-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden safe-area-bottom">
      {/* Glass background */}
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-2xl border-t border-white/10" />

      <div className="relative flex items-end justify-around px-2 pb-1 pt-1">
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

        {/* Center Xbox Button - Floating */}
        <button
          onClick={scrollToXbox}
          className="relative -mt-5 group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#107C10]/50 to-green-500/50 rounded-full blur-lg opacity-60 group-hover:opacity-100 group-active:opacity-100 transition-opacity" />
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-[3px] border-navy-dark shadow-2xl ring-2 ring-[#107C10]/40 group-active:scale-95 transition-transform flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #107C10, #0a5a0a)" }}
          >
            <Gamepad2 className="w-8 h-8 text-white" />
            {/* Green dot indicator */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00ff00] rounded-full border-2 border-navy-dark animate-pulse" />
          </div>
          <span className="block text-center text-[10px] font-bold text-[#107C10] mt-1">Xbox</span>
        </button>

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
      </div>
    </nav>
  );
}
