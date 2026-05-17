"use client";

import Link from "next/link";
import { ArrowRight, Plus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import type { Category, SubCategory, Denomination } from "@/lib/products";
import { useCartStore } from "@/lib/store";

interface CategoryPageClientProps {
  category: Category;
  categories?: Category[];
}

export default function CategoryPageClient({ category, categories = [] }: CategoryPageClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const { categories: liveCategories, fetchCategories } = useCartStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    if (!liveCategories || liveCategories.length === 0) {
      fetchCategories();
    }
  }, [liveCategories, fetchCategories]);

  // Use live data if available, fallback to static data
  const activeCategory = liveCategories?.find(c => c.id === category.id) || category;
  const activeCategories = liveCategories && liveCategories.length > 0 ? liveCategories : categories;

  const handleAddToCart = (
    subId: string,
    denomLabel: string,
    denomValue: string,
    region: string,
    priceLYD: number,
    priceLibyana: number
  ) => {
    const uniqueKey = `${subId}-${denomValue}`;
    addItem({
      id: subId,
      name: activeCategory.name,
      region: region,
      value: denomLabel,
      quantity: 1,
      priceLYD,
      priceLibyana
    });

    setAddedItems((prev) => new Set(prev).add(uniqueKey));
    
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(uniqueKey);
        return next;
      });
    }, 1500);
  };

  const hasBgImage = activeCategory.bgUrl && activeCategory.bgUrl.length > 0;

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Header categories={activeCategories} />

      <main className="flex-grow pb-24 md:pb-12">
        {/* ===== HERO BACKGROUND SECTION ===== */}
        <div className="relative w-full overflow-hidden" style={{ minHeight: "420px" }}>
          {/* Background Image or Gradient Fallback */}
          {hasBgImage ? (
            <img
              src={activeCategory.bgUrl}
              alt={activeCategory.nameEn}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${activeCategory.gradient}`} />
          )}

          {/* Dark overlays for depth */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

          {/* Animated decorative elements */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-crimson/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

          {/* Content overlay */}
          <div className="relative container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8" style={{ minHeight: "420px" }}>
            {/* Back Button */}
            <Link
              href="/"
              className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-white/30"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Link>

            {/* Product Image - Large showcase */}
            <div className={`flex-shrink-0 transition-all duration-700 ${loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              <div className="relative group">
                {/* Glow behind image */}
                <div className={`absolute -inset-4 bg-gradient-to-br ${activeCategory.gradient} rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-2xl">
                  <img
                    src={activeCategory.productImageUrl}
                    alt={activeCategory.nameEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>

            {/* Category Info */}
            <div className={`text-center md:text-right transition-all duration-700 delay-200 ${loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
                {activeCategory.name}
              </h1>
              <p className="text-white/50 text-xl md:text-2xl font-bold tracking-[0.3em] uppercase mb-5">
                {activeCategory.nameEn}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm font-medium border border-white/15">
                  📍 {activeCategory.subCategories.length} منطقة
                </span>
                <span className="px-5 py-2 bg-crimson/20 backdrop-blur-md rounded-full text-crimson-light text-sm font-bold border border-crimson/30">
                  🛒 {activeCategory.subCategories.reduce((s: number, sub: SubCategory) => s + sub.denominations.length, 0)} منتج
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PRODUCTS SECTION ===== */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="space-y-10">
            {activeCategory.subCategories.map((sub: SubCategory, subIndex: number) => (
              <div
                key={sub.id}
                className={`transition-all duration-500 ${loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: `${300 + subIndex * 100}ms` }}
              >
                {/* Region Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-8 bg-crimson rounded-full" />
                  <h2 className="text-white text-xl font-bold">
                    {activeCategory.name} - {sub.region}
                  </h2>
                  {sub.currency && (
                    <span className="px-3 py-1 bg-crimson/20 text-crimson-light text-xs font-bold rounded-full border border-crimson/30">
                      {sub.currency}
                    </span>
                  )}
                </div>

                {/* Denomination Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {sub.denominations.map((denom: Denomination, denomIndex: number) => {
                    const uniqueKey = `${sub.id}-${denom.value}`;
                    const isAdded = addedItems.has(uniqueKey);

                    return (
                      <div
                        key={denom.value}
                        className={`group bg-navy-light rounded-xl border border-border/50 hover:border-crimson/50 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-crimson/5 ${loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: `${400 + (subIndex * 4 + denomIndex) * 40}ms` }}
                      >
                        {/* Card Top - Value Display */}
                        <div className={`relative p-5 bg-gradient-to-br ${activeCategory.gradient} bg-opacity-20`}>
                          <div className="absolute inset-0 bg-black/40" />
                          {/* Small product thumbnail */}
                          <div className="absolute top-2 left-2 w-8 h-8 rounded-lg overflow-hidden border border-white/20 opacity-60">
                            <img
                              src={activeCategory.productImageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="relative text-center flex flex-col items-center justify-center gap-2">
                            <p className="text-white font-black text-2xl drop-shadow-lg">
                              {denom.label}
                            </p>
                            <div className="bg-navy-dark/95 backdrop-blur-md px-4 py-2 rounded-xl border border-gold-light/30 mt-2 shadow-[0_0_15px_rgba(250,204,21,0.15)] transform transition-transform group-hover:scale-105">
                              <p className="text-gold-light font-black text-lg md:text-xl tracking-wide">
                                {paymentMethod === 'lyd' 
                                  ? `${denom.priceLYD} د.ل` 
                                  : `${denom.priceLibyana} رصيد`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom - Add to Cart */}
                        <div className="p-3">
                          <button
                            onClick={() =>
                              handleAddToCart(
                                sub.id,
                                denom.label,
                                denom.value,
                                `${activeCategory.name} - ${sub.region}`,
                                denom.priceLYD || 0,
                                denom.priceLibyana || 0
                              )
                            }
                            disabled={isAdded}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                              isAdded
                                ? "bg-green-600/20 text-green-400 border border-green-500/30"
                                : "bg-crimson/20 text-crimson-light border border-crimson/30 hover:bg-crimson hover:text-white hover:border-crimson"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                تمت الإضافة
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                أضف للسلة
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />


    </div>
  );
}
