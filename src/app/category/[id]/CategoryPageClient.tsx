"use client";

import Link from "next/link";
import { ArrowRight, Plus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import type { Category, SubCategory, Denomination } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { assetPath } from "@/lib/utils";

interface CategoryPageClientProps {
  category: Category;
  categories?: Category[];
}

export default function CategoryPageClient({ category, categories = [] }: CategoryPageClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

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
      name: category.name,
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

  const hasBgImage = category.bgUrl && category.bgUrl.length > 0;

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Header categories={categories} />

      <main className="flex-grow pb-24 md:pb-12">
        {/* ===== HERO BACKGROUND SECTION ===== */}
        <div className="relative w-full overflow-hidden" style={{ minHeight: "420px" }}>
          {/* Background Image or Gradient Fallback */}
          {hasBgImage ? (
            <img
              src={assetPath(category.bgUrl)}
              alt={category.nameEn}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-premium ${loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
          )}

          {/* Dark overlays for depth */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

          {/* Animated decorative elements */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-white/[0.03] rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-crimson/[0.06] rounded-full blur-3xl animate-float-delayed" />

          {/* Content overlay */}
          <div className="relative container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8 md:gap-12" style={{ minHeight: "420px" }}>
            {/* Back Button */}
            <Link
              href="/"
              className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 ease-premium text-sm font-bold bg-white/[0.06] backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.1]"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Link>

            {/* Product Image - Large showcase */}
            <div className={`flex-shrink-0 transition-all duration-[800ms] ease-premium ${loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              <div className="relative group">
                {/* Glow behind image */}
                <div className={`absolute -inset-5 bg-gradient-to-br ${category.gradient} rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500 ease-smooth`} />
                <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden bg-white/[0.06] backdrop-blur-md border-2 border-white/15 shadow-premium-lg">
                  <img
                    src={assetPath(category.productImageUrl)}
                    alt={category.nameEn}
                    className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.08]"
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-smooth" />
                </div>
              </div>
            </div>

            {/* Category Info */}
            <div className={`text-center md:text-right transition-all duration-[800ms] ease-premium delay-200 ${loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg leading-tight">
                {category.name}
              </h1>
              <p className="text-white/40 text-xl md:text-2xl font-bold tracking-[0.3em] uppercase mb-6">
                {category.nameEn}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="px-5 py-2.5 bg-white/[0.06] backdrop-blur-md rounded-full text-white/70 text-sm font-bold border border-white/[0.08]">
                  📍 {category.subCategories.length} منطقة
                </span>
                <span className="px-5 py-2.5 bg-crimson/15 backdrop-blur-md rounded-full text-crimson-light text-sm font-black border border-crimson/20">
                  🛒 {category.subCategories.reduce((s: number, sub: SubCategory) => s + sub.denominations.length, 0)} منتج
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PRODUCTS SECTION ===== */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="space-y-12">
            {category.subCategories.map((sub: SubCategory, subIndex: number) => (
              <div
                key={sub.id}
                className={`transition-all duration-[600ms] ease-premium ${loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: `${300 + subIndex * 100}ms` }}
              >
                {/* Region Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-crimson to-crimson/30 rounded-full" />
                  <h2 className="text-white text-xl font-black">
                    {category.name} - {sub.region}
                  </h2>
                  {sub.currency && (
                    <span className="px-3 py-1.5 bg-crimson/10 text-crimson-light text-xs font-bold rounded-full border border-crimson/15">
                      {sub.currency}
                    </span>
                  )}
                </div>

                {/* Denomination Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {sub.denominations.map((denom: Denomination, denomIndex: number) => {
                    const uniqueKey = `${sub.id}-${denom.value}`;
                    const isAdded = addedItems.has(uniqueKey);

                    return (
                      <div
                        key={denom.value}
                        className={`group bg-navy-light/80 rounded-xl border border-white/[0.05] hover:border-crimson/30 overflow-hidden transition-all duration-[400ms] ease-premium hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(139,26,26,0.08)] ${loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: `${400 + (subIndex * 4 + denomIndex) * 40}ms` }}
                      >
                        {/* Card Top - Value Display */}
                        <div className={`relative p-5 md:p-6 bg-gradient-to-br ${category.gradient} bg-opacity-20`}>
                          <div className="absolute inset-0 bg-black/40" />
                          {/* Small product thumbnail */}
                          <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-lg overflow-hidden border border-white/15 opacity-50">
                            <img
                              src={assetPath(category.productImageUrl)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="relative text-center flex flex-col items-center justify-center gap-2">
                            <p className="text-white font-black text-2xl drop-shadow-lg">
                              {denom.label}
                            </p>
                            <div className="bg-navy-dark/90 backdrop-blur-xl px-4 py-2.5 rounded-xl border border-gold-light/20 mt-2 shadow-[0_0_20px_rgba(250,204,21,0.1)] transform transition-transform duration-300 ease-premium group-hover:scale-105">
                              <p className="text-gold-light font-black text-lg md:text-xl tracking-wide leading-none">
                                {paymentMethod === 'lyd' 
                                  ? `${denom.priceLYD} د.ل` 
                                  : `${denom.priceLibyana} رصيد`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom - Add to Cart */}
                        <div className="p-3 md:p-3.5">
                          <button
                            onClick={() =>
                              handleAddToCart(
                                sub.id,
                                denom.label,
                                denom.value,
                                `${category.name} - ${sub.region}`,
                                denom.priceLYD || 0,
                                denom.priceLibyana || 0
                              )
                            }
                            disabled={isAdded}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ease-premium ${
                              isAdded
                                ? "bg-green-600/15 text-green-400 border border-green-500/20"
                                : "bg-crimson/15 text-crimson-light border border-crimson/20 hover:bg-crimson hover:text-white hover:border-crimson hover:shadow-glow-crimson active:scale-[0.97]"
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
