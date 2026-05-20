"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ShoppingCart, X, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import CartDrawer from "./CartDrawer";
import type { Category } from "@/lib/products";
import { assetPath } from "@/lib/utils";
import sharedAccountsData from "@/data/shared-accounts.json";

interface SearchResult {
  id: string;
  name: string;
  nameSecondary: string;
  image: string;
  type: "card" | "game";
  href: string;
}

export default function Header({ categories = [] }: { categories?: Category[] }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [cartToast, setCartToast] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((s) => s.items);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod);
  const loadCart = useCartStore((s) => s.loadCart);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const prevTotalRef = useRef(totalItems);
  const isInitializedRef = useRef(false);

  // Load persisted cart on client-side mount to avoid hydration mismatch
  useEffect(() => {
    loadCart();
    const timer = setTimeout(() => {
      isInitializedRef.current = true;
    }, 150);
    return () => clearTimeout(timer);
  }, [loadCart]);

  // Build unified search index across all site items
  const allItems = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    // Categories (cards)
    for (const c of categories) {
      results.push({
        id: c.id,
        name: c.name,
        nameSecondary: c.nameEn,
        image: c.productImageUrl,
        type: "card",
        href: `/category/${c.id}`,
      });
    }

    // Shared accounts (games)
    for (const sa of sharedAccountsData) {
      results.push({
        id: sa.id,
        name: sa.title,
        nameSecondary: sa.titleAr,
        image: sa.image,
        type: "game",
        href: "/#shared-accounts",
      });
    }

    return results;
  }, [categories]);

  const filteredResults = searchQuery.trim()
    ? allItems
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.nameSecondary.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10)
    : [];

  // Listen for open-cart custom event from MobileNav
  useEffect(() => {
    const handler = () => setShowCart(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  // Show toast notification when items are added to cart
  useEffect(() => {
    if (isInitializedRef.current && totalItems > prevTotalRef.current && totalItems > 0) {
      setCartToast(true);
      const timer = setTimeout(() => setCartToast(false), 4000);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(timer);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 w-full flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        {/* Top Bar for Currency Selection — subtle gradient */}
        <div className="bg-gradient-to-b from-navy-dark to-navy-dark/95 border-b border-white/[0.04] py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <span className="text-[11px] md:text-sm text-white/50 font-bold">عرض الأسعار بـ:</span>
            <div className="flex bg-navy/80 rounded-xl p-1 border border-white/[0.06] shadow-inner-glow">
              <button
                onClick={() => setPaymentMethod('lyd')}
                className={`px-3 md:px-5 py-1.5 text-[11px] md:text-xs font-black rounded-lg transition-all duration-300 ease-premium ${
                  paymentMethod === 'lyd'
                    ? 'bg-crimson text-white shadow-glow-crimson'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                دينار ليبي 💵
              </button>
              <button
                onClick={() => setPaymentMethod('libyana')}
                className={`px-3 md:px-5 py-1.5 text-[11px] md:text-xs font-black rounded-lg transition-all duration-300 ease-premium ${
                  paymentMethod === 'libyana'
                    ? 'bg-crimson text-white shadow-glow-crimson'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                رصيد ليبيانا 📱
              </button>
            </div>
          </div>
        </div>

        <header className="w-full bg-navy-dark/90 backdrop-blur-2xl border-b border-white/[0.04] overflow-x-clip">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20 md:h-[72px] gap-3">
            {/* Right Side: Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-14 h-14 md:w-[52px] md:h-[52px] rounded-full overflow-hidden shadow-premium group-hover:shadow-glow-crimson transition-all duration-[400ms] ease-premium group-hover:scale-[1.04] ring-2 ring-crimson/15 group-hover:ring-crimson/35 flex-shrink-0">
                <img src={assetPath("/logo.png")} alt="MD218.LY" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl md:text-2xl leading-tight tracking-wider">
                  <span className="text-white">MD</span>
                  <span className="text-crimson">218</span>
                </span>
                <span className="text-white text-[10px] md:text-xs font-bold -mt-0.5 tracking-[0.3em]">LY</span>
              </div>
            </Link>

            {/* Center / Right: Nav Items */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
              {/* Search */}
              <div ref={searchRef} className="relative">
                {showSearch && (
                  <div className="fixed inset-x-3 top-[140px] md:absolute md:inset-x-auto md:top-full md:left-0 md:mt-3 md:w-96 bg-navy-light/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.5)] p-4 z-50 animate-fade-in-scale">
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن بطاقة، لعبة، حساب..."
                      className="w-full bg-navy/80 border border-white/[0.06] text-white rounded-xl focus:ring-2 focus:ring-crimson/40 focus:border-crimson/40 transition-all duration-200 py-2.5 px-4 placeholder-white/25 text-sm outline-none"
                    />
                    {filteredResults.length > 0 && (
                      <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                        {filteredResults.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => {
                              setShowSearch(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 ease-premium"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10 flex-shrink-0">
                              <img
                                src={assetPath(item.image)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-white/35 text-xs truncate">
                                  {item.nameSecondary}
                                </p>
                                {item.type === "card" ? (
                                  <span className="text-[8px] bg-crimson/20 text-crimson-light px-1.5 py-0.5 rounded font-bold flex-shrink-0">
                                    بطاقة
                                  </span>
                                ) : (
                                  <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold flex-shrink-0">
                                    لعبة
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchQuery.trim() && filteredResults.length === 0 && (
                      <p className="mt-3 text-white/30 text-sm text-center py-4">
                        لا توجد نتائج
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300 ease-premium"
                  aria-label="بحث"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Button with Toast */}
              <div className="relative">
                <button
                  onClick={() => setShowCart(true)}
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300 ease-premium"
                  aria-label="السلة"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-crimson text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-glow-crimson animate-bounce-once">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Cart Toast Notification */}
                {cartToast && (
                  <div className="fixed top-[100px] md:top-full left-1/2 -translate-x-1/2 md:mt-4 z-[100] animate-toast-in w-[92%] max-w-[340px] md:w-auto md:max-w-none">
                    <button
                      onClick={() => {
                        setCartToast(false);
                        setShowCart(true);
                      }}
                      className="group flex flex-col items-center bg-gradient-to-br from-crimson via-red-600 to-crimson-dark text-white p-1 rounded-2xl shadow-glow-crimson-lg transition-all duration-300 ease-premium hover:scale-[1.03] active:scale-[0.97]"
                    >
                      <div className="flex items-center gap-3 px-6 py-3.5 bg-navy-dark/10 rounded-xl w-full">
                        <div className="relative">
                          <ShoppingCart className="w-6 h-6 animate-bounce" />
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-black tracking-wide">
                            تمت الإضافة بنجاح! 🛍️
                          </span>
                          <span className="text-[11px] font-bold text-white/80 opacity-90">
                            انقر هنا لإتمام الطلب الآن
                          </span>
                        </div>
                        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                    <div className="absolute inset-0 -z-10 bg-crimson/20 rounded-2xl blur-xl animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
