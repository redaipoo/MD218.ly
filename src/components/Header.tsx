"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, X, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import CartDrawer from "./CartDrawer";
import type { Category } from "@/lib/products";

export default function Header({ categories = [] }: { categories?: Category[] }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [cartToast, setCartToast] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((s) => s.items);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const prevTotalRef = useRef(totalItems);

  const filteredCategories = searchQuery.trim()
    ? categories.filter(
        (c) =>
          c.name.includes(searchQuery) ||
          c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Listen for open-cart custom event from MobileNav
  useEffect(() => {
    const handler = () => setShowCart(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  // Show toast notification when items are added to cart
  useEffect(() => {
    if (totalItems > prevTotalRef.current && totalItems > 0) {
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
      <div className="sticky top-0 z-50 w-full flex flex-col shadow-2xl shadow-black/20">
        {/* Top Bar for Currency Selection */}
        <div className="bg-navy-dark border-b border-white/5 py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <span className="text-[11px] md:text-sm text-white/70 font-bold">عرض الأسعار بـ:</span>
            <div className="flex bg-navy rounded-lg p-1 border border-white/10 shadow-inner">
              <button
                onClick={() => setPaymentMethod('lyd')}
                className={`px-3 md:px-5 py-1.5 text-[11px] md:text-xs font-black rounded-md transition-all ${
                  paymentMethod === 'lyd'
                    ? 'bg-crimson text-white shadow-lg shadow-crimson/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                دينار ليبي 💵
              </button>
              <button
                onClick={() => setPaymentMethod('libyana')}
                className={`px-3 md:px-5 py-1.5 text-[11px] md:text-xs font-black rounded-md transition-all ${
                  paymentMethod === 'libyana'
                    ? 'bg-crimson text-white shadow-lg shadow-crimson/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                رصيد ليبيانا 📱
              </button>
            </div>
          </div>
        </div>

        <header className="w-full bg-navy-dark/95 backdrop-blur-xl border-b border-border/40 overflow-x-clip">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20 md:h-[72px] gap-3">
            {/* Right Side: Logo - Bigger & More Prominent */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-14 h-14 md:w-[52px] md:h-[52px] rounded-2xl overflow-hidden shadow-lg shadow-crimson/30 group-hover:shadow-crimson/50 transition-all duration-300 group-hover:scale-105 ring-2 ring-crimson/20 group-hover:ring-crimson/40 flex-shrink-0">
                <img src="/logo.png" alt="MD218.LY" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-xl md:text-2xl leading-tight tracking-wider">MD218</span>
                <span className="text-crimson-light text-[10px] md:text-xs font-bold -mt-0.5 tracking-[0.3em]">.LY</span>
              </div>
            </Link>

            {/* Center / Right: Nav Items */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              {/* Search */}
              <div ref={searchRef} className="relative">
                {showSearch && (
                  <div className="absolute top-full left-0 mt-3 w-80 bg-navy-light/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/60 p-4 z-50 animate-slide-up">
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن بطاقة..."
                      className="w-full bg-navy border border-border text-white rounded-xl focus:ring-2 focus:ring-crimson/50 focus:border-crimson transition-all py-2.5 px-4 placeholder-white/30 text-sm"
                    />
                    {filteredCategories.length > 0 && (
                      <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                        {filteredCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden">
                              <img src={cat.productImageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{cat.name}</p>
                              <p className="text-white/40 text-xs">{cat.nameEn}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="بحث"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Button with Toast */}
              <div className="relative">
                <button
                  onClick={() => setShowCart(true)}
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="السلة"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-crimson text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg shadow-crimson/40 animate-bounce-once">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Cart Toast Notification - More prominent and urgent */}
                {cartToast && (
                  <div className="fixed md:absolute bottom-24 md:bottom-auto md:translate-y-0 md:top-full left-1/2 -translate-x-1/2 md:mt-4 whitespace-nowrap z-[100] animate-toast-in">
                    <button
                      onClick={() => { setCartToast(false); setShowCart(true); }}
                      className="group flex flex-col items-center bg-gradient-to-br from-crimson via-red-600 to-crimson-dark text-white p-1 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center gap-3 px-6 py-3.5 bg-navy-dark/10 rounded-xl w-full">
                        <div className="relative">
                          <ShoppingCart className="w-6 h-6 animate-bounce" />
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-black tracking-wide">تمت الإضافة بنجاح! 🛍️</span>
                          <span className="text-[11px] font-bold text-white/80 opacity-90">انقر هنا لإتمام الطلب الآن</span>
                        </div>
                        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </button>
                    {/* Pulsing ring around toast */}
                    <div className="absolute inset-0 -z-10 bg-crimson/30 rounded-2xl blur-xl animate-pulse" />
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
