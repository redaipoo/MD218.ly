"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import { Gamepad2, Users, CreditCard, Plus, Check, SlidersHorizontal, ArrowUpDown, Star } from "lucide-react";
import type { Category } from "@/lib/products";
import sharedAccounts from "@/data/shared-accounts.json";
import xboxGamesData from "@/data/xbox-games.json";
import { useCartStore } from "@/lib/store";
import { assetPath } from "@/lib/utils";

type TabId = "cards" | "accounts" | "games";

interface SharedAccount {
  id: string;
  title: string;
  titleAr: string;
  image: string;
  priceLYD: number;
  priceLibyana: number;
  originalPriceLYD?: number;
  originalPriceLibyana?: number;
  discountPercent?: number;
  platforms?: string;
  rating?: number;
  durationText?: string;
}

interface FullAccount extends SharedAccount {
  games: string[];
  gameImages?: string[];
}

export default function HomeTabs({ categories }: { categories: Category[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("cards");
  const [gamesSubTab, setGamesSubTab] = useState<"buyOnAccount" | "fullAccounts">("buyOnAccount");
  const addItem = useCartStore((s) => s.addItem);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>("default");
  const [filterPrice, setFilterPrice] = useState<string>("all");

  const xboxGames = xboxGamesData as { buyOnAccount: SharedAccount[]; fullAccounts: FullAccount[] };

  const filteredBuyGames = [...xboxGames.buyOnAccount].filter((game) => {
    const price = paymentMethod === 'lyd' ? game.priceLYD : game.priceLibyana;
    if (filterPrice === "under-10") return price <= 10;
    if (filterPrice === "under-20") return price <= 20;
    if (filterPrice === "over-20") return price > 20;
    return true;
  });

  const sortedBuyGames = [...filteredBuyGames].sort((a, b) => {
    if (sortBy === "price-asc") {
      const priceA = paymentMethod === 'lyd' ? a.priceLYD : a.priceLibyana;
      const priceB = paymentMethod === 'lyd' ? b.priceLYD : b.priceLibyana;
      return priceA - priceB;
    }
    if (sortBy === "newest") {
      const numA = parseInt(a.id.split("-")[1]) || 0;
      const numB = parseInt(b.id.split("-")[1]) || 0;
      return numB - numA;
    }
    return 0;
  });

  const handleAddToCart = (game: SharedAccount) => {
    addItem({
      id: game.id,
      name: game.title,
      region: game.titleAr,
      value: "حساب مشترك",
      quantity: 1,
      priceLYD: game.priceLYD,
      priceLibyana: game.priceLibyana
    });

    setAddedItems((prev) => new Set(prev).add(game.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(game.id);
        return next;
      });
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Segmented Control Tabs — Premium Glass */}
      <div className="container mx-auto px-4 mt-6 mb-10">
        <div className="flex justify-center">
          <div className="flex bg-navy-dark/80 backdrop-blur-xl border border-white/[0.06] p-1.5 rounded-full shadow-premium overflow-x-auto custom-scrollbar w-full max-w-2xl relative">
            {/* Reflective top edge */}
            <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <button
              onClick={() => setActiveTab("cards")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm md:text-base font-black transition-all duration-[350ms] ease-premium whitespace-nowrap ${
                activeTab === "cards"
                  ? "bg-crimson text-white shadow-glow-crimson transform scale-[1.02]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              البطاقات
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm md:text-base font-black transition-all duration-[350ms] ease-premium whitespace-nowrap ${
                activeTab === "accounts"
                  ? "bg-crimson text-white shadow-glow-crimson transform scale-[1.02]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              حسابات مشتركة
            </button>
            <button
              onClick={() => setActiveTab("games")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm md:text-base font-black transition-all duration-[350ms] ease-premium whitespace-nowrap ${
                activeTab === "games"
                  ? "bg-crimson text-white shadow-glow-crimson transform scale-[1.02]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <Gamepad2 className="w-4 h-4 md:w-5 md:h-5" />
              ألعاب رقمية
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === "cards" && (
          <section className="container mx-auto px-4 animate-fade-in-scale">
            <ProductGrid categories={categories} />
          </section>
        )}

        {activeTab === "accounts" && (
          <section className="container mx-auto px-4 animate-fade-in-scale mt-2">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ textShadow: "0 0 20px rgba(16,124,16,0.4)" }}>
                حسابات ألعاب مشتركة
              </h2>
              <p className="text-white/50 text-center max-w-lg text-sm md:text-base leading-relaxed">
                استمتع بأفضل الألعاب بأقل الأسعار! حسابات أصلية ومضمونة بتفعيل فوري.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 stagger-grid">
              {sharedAccounts.map((game) => {
                const isAdded = addedItems.has(game.id);
                return (
                  <div
                    key={game.id}
                    className="group bg-navy-light/80 rounded-2xl border border-white/[0.05] hover:border-[#107C10]/40 overflow-hidden transition-all duration-[400ms] ease-premium hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(16,124,16,0.12)] active:scale-[0.98] flex flex-col"
                  >
                    {/* Game Cover */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-black/50">
                      <img
                        src={assetPath(game.image)}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-[600ms] ease-premium group-hover:scale-[1.06] opacity-90 group-hover:opacity-100"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/20 to-transparent" />
                      
                      {/* Price Badge Overlay — premium glass */}
                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xl border border-white/[0.08] px-2.5 py-1.5 rounded-lg shadow-premium">
                        <p className="text-[#00ff00] font-black text-xs md:text-sm leading-none">
                          {paymentMethod === 'lyd' ? `${game.priceLYD} د.ل` : `${game.priceLibyana} رصيد`}
                        </p>
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="p-3 md:p-3.5 flex-1 flex flex-col justify-between">
                      <div className="mb-3">
                        <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-1 group-hover:text-[#00ff00] transition-colors duration-300" dir="ltr">
                          {game.title}
                        </h3>
                        <p className="text-white/35 text-[10px] md:text-xs font-bold">{game.titleAr}</p>
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(game)}
                        disabled={isAdded}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all duration-300 ease-premium ${
                          isAdded
                            ? "bg-green-600/15 text-green-400 border border-green-500/20"
                            : "bg-[#107C10]/15 text-[#00ff00] border border-[#107C10]/20 hover:bg-[#107C10] hover:text-white hover:shadow-[0_0_15px_rgba(16,124,16,0.45)] active:scale-[0.97]"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" /> تم
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> للسلة
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "games" && (
          <section className="container mx-auto px-4 animate-fade-in-scale mt-2">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ textShadow: "0 0 20px rgba(16,124,16,0.4)" }}>
                ألعاب Xbox الرقمية
              </h2>
              <p className="text-white/50 text-center max-w-lg text-sm md:text-base leading-relaxed mb-6">
                اختر طريقة الشراء المناسبة لك
              </p>

              {/* Sub Tabs */}
              <div className="flex gap-2 p-1.5 bg-navy-dark/80 backdrop-blur-xl rounded-full border border-white/[0.06] shadow-premium w-full max-w-md">
                <button
                  onClick={() => setGamesSubTab("buyOnAccount")}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-black transition-all duration-300 ease-premium ${
                    gamesSubTab === "buyOnAccount"
                      ? "bg-[#107C10] text-white shadow-[0_0_20px_rgba(16,124,16,0.3)]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                  }`}
                >
                  🎮 شراء في حسابك
                </button>
                <button
                  onClick={() => setGamesSubTab("fullAccounts")}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs md:text-sm font-black transition-all duration-300 ease-premium ${
                    gamesSubTab === "fullAccounts"
                      ? "bg-[#107C10] text-white shadow-[0_0_20px_rgba(16,124,16,0.3)]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                  }`}
                >
                  👤 حسابات كاملة
                </button>
              </div>
            </div>

            {/* SORT & FILTER TOOLBAR (only for buyOnAccount) */}
            {gamesSubTab === "buyOnAccount" && xboxGames.buyOnAccount.length > 0 && (
              <div className="w-full max-w-3xl mx-auto bg-navy-dark/60 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4 mb-6 shadow-premium">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  {/* Sort Controls */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <ArrowUpDown className="w-4 h-4 text-[#00ff00] flex-shrink-0" />
                    <span className="text-white/50 text-xs font-black whitespace-nowrap">الفرز:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto bg-navy-light/95 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-black outline-none focus:border-[#107C10] cursor-pointer"
                    >
                      <option value="default">الافتراضي (ترتيب الأدمن)</option>
                      <option value="price-asc">الأرخص سعراً أولاً</option>
                      <option value="newest">أحدث الألعاب المضافة</option>
                    </select>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SlidersHorizontal className="w-4 h-4 text-[#00ff00] flex-shrink-0" />
                    <span className="text-white/50 text-xs font-black whitespace-nowrap">السعر:</span>
                    <select
                      value={filterPrice}
                      onChange={(e) => setFilterPrice(e.target.value)}
                      className="w-full sm:w-auto bg-navy-light/95 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-black outline-none focus:border-[#107C10] cursor-pointer"
                    >
                      <option value="all">كل الأسعار</option>
                      <option value="under-10">10 {paymentMethod === 'lyd' ? "د.ل" : "رصيد"} أو أقل</option>
                      <option value="under-20">20 {paymentMethod === 'lyd' ? "د.ل" : "رصيد"} أو أقل</option>
                      <option value="over-20">أكثر من 20 {paymentMethod === 'lyd' ? "د.ل" : "رصيد"}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Games Render logic */}
            {gamesSubTab === "buyOnAccount" ? (
              // ===== BUY ON ACCOUNT SECTION (Vertical Xbox Deals-Style List) =====
              xboxGames.buyOnAccount.length === 0 ? (
                // Empty state for whole section
                <div className="max-w-xl mx-auto text-center py-12">
                  <div className="relative rounded-3xl overflow-hidden p-10 md:p-14 shadow-premium-lg" style={{ background: "linear-gradient(180deg, #0a1f0a 0%, #050f05 100%)", border: "1px solid rgba(16,124,16,0.2)" }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#107C10]/10 rounded-full blur-3xl pointer-events-none animate-ambient" />
                    <div className="relative">
                      <div className="w-16 h-16 bg-[#107C10]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#107C10]/15">
                        <Gamepad2 className="w-8 h-8 text-[#00ff00]" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3" style={{ textShadow: "0 0 12px #107C10" }}>قريباً... ألعاب شراء في حسابك!</h3>
                      <p className="text-white/50 text-sm leading-relaxed">نعمل على إضافة ألعاب يتم تنزيلها مباشرة في حسابك.</p>
                    </div>
                  </div>
                </div>
              ) : sortedBuyGames.length === 0 ? (
                // Empty state for active filter
                <div className="text-center py-16 bg-navy-dark/40 border border-white/[0.05] rounded-3xl max-w-xl mx-auto">
                  <SlidersHorizontal className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-white mb-2">لا توجد ألعاب تطابق خيار التصفية الحالي</h3>
                  <p className="text-white/40 text-xs">جرب اختيار نطاق سعر آخر أو تصفح كل الألعاب.</p>
                </div>
              ) : (
                // The Xbox Deals-Style List Layout!
                <div className="max-w-3xl mx-auto flex flex-col gap-3 pb-8">
                  {sortedBuyGames.map((game) => {
                    const isAdded = addedItems.has(game.id);
                    const currentPrice = paymentMethod === 'lyd' ? game.priceLYD : game.priceLibyana;
                    const originalPrice = paymentMethod === 'lyd' ? game.originalPriceLYD : game.originalPriceLibyana;
                    
                    // Fallback calculations for discount badge if not explicitly defined
                    let discount = game.discountPercent;
                    if (!discount && originalPrice && originalPrice > currentPrice) {
                      discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
                    }

                    return (
                      <div
                        key={game.id}
                        className="group relative flex bg-navy-light/40 backdrop-blur-md rounded-2xl border border-white/[0.06] hover:border-[#107C10]/40 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_15px_rgba(16,124,16,0.06)] hover:-translate-y-0.5 active:scale-[0.99] p-3 gap-3 md:gap-4 items-center"
                      >
                        {/* Right: Game Cover Image */}
                        <div className="relative w-[72px] h-[96px] md:w-[80px] md:h-[106px] rounded-xl overflow-hidden bg-black/40 border border-white/[0.08] flex-shrink-0">
                          <img
                            src={assetPath(game.image)}
                            alt={game.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Center: Metadata details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex flex-wrap gap-2 items-center mb-1.5">
                            <h3 className="text-white font-black text-sm md:text-base truncate leading-snug group-hover:text-[#00ff00] transition-colors duration-300" dir="ltr">
                              {game.title}
                            </h3>
                            {discount && discount > 0 && (
                              <span className="bg-[#107C10] text-white font-extrabold text-[10px] md:text-xs px-2 py-0.5 rounded-md shadow-[0_0_8px_rgba(16,124,16,0.35)]" dir="ltr">
                                -%{discount}
                              </span>
                            )}
                          </div>

                          {/* Platforms and Rating */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                            <span className="text-[#00ff00] font-black tracking-wider text-[10px] bg-[#107C10]/10 border border-[#107C10]/20 px-1.5 py-0.5 rounded">
                              {game.platforms || "Series X|S | One"}
                            </span>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-1 text-gold-light font-black text-[11px] md:text-xs">
                              <Star className="w-3.5 h-3.5 fill-current text-gold-light" />
                              <span>{game.rating || "4.5"}</span>
                            </div>

                            {/* Delivery/Quick Time */}
                            <span className="text-white/40 text-[10px] md:text-[11px] font-bold">
                              • {game.durationText || "تفعيل فوري"}
                            </span>
                          </div>
                        </div>

                        {/* Left: Prices & Add button */}
                        <div className="flex flex-col items-end justify-center gap-2 flex-shrink-0 pl-1">
                          {/* Price Stack */}
                          <div className="text-left font-black">
                            <p className="text-[#00ff00] text-sm md:text-base leading-none">
                              {currentPrice} {paymentMethod === 'lyd' ? "د.ل" : "رصيد"}
                            </p>
                            {originalPrice && originalPrice > currentPrice && (
                              <p className="text-white/35 text-[11px] md:text-xs line-through mt-1 text-right">
                                {originalPrice} {paymentMethod === 'lyd' ? "د.ل" : "رصيد"}
                              </p>
                            )}
                          </div>

                          {/* Add to Cart button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(game);
                            }}
                            disabled={isAdded}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all duration-300 ${
                              isAdded
                                ? "bg-green-600/15 text-green-400 border border-green-500/20"
                                : "bg-[#107C10]/15 text-[#00ff00] border border-[#107C10]/20 hover:bg-[#107C10] hover:text-white active:scale-95 hover:shadow-[0_0_12px_rgba(16,124,16,0.3)]"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>تم</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>للسلة</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              // ===== FULL ACCOUNTS SECTION (Xbox-Style Grid) =====
              xboxGames.fullAccounts.length === 0 ? (
                <div className="max-w-xl mx-auto text-center py-12">
                  <div className="relative rounded-3xl overflow-hidden p-10 md:p-14 shadow-premium-lg" style={{ background: "linear-gradient(180deg, #0a1f0a 0%, #050f05 100%)", border: "1px solid rgba(16,124,16,0.2)" }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#107C10]/10 rounded-full blur-3xl pointer-events-none animate-ambient" />
                    <div className="relative">
                      <div className="w-16 h-16 bg-[#107C10]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#107C10]/15">
                        <Gamepad2 className="w-8 h-8 text-[#00ff00]" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3" style={{ textShadow: "0 0 12px #107C10" }}>قريباً... حسابات كاملة!</h3>
                      <p className="text-white/50 text-sm leading-relaxed">نعمل على إضافة حسابات كاملة جاهزة بالألعاب.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 stagger-grid pb-8">
                  {xboxGames.fullAccounts.map((game) => {
                    const isAdded = addedItems.has(game.id);
                    return (
                      <div
                        key={game.id}
                        className="group bg-navy-light/80 rounded-2xl border border-white/[0.05] hover:border-[#107C10]/40 overflow-hidden transition-all duration-[400ms] ease-premium hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(16,124,16,0.12)] active:scale-[0.98] flex flex-col"
                      >
                        {/* Game Cover */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-black/50">
                          <img
                            src={assetPath(game.image)}
                            alt={game.title}
                            className="w-full h-full object-cover transition-transform duration-[600ms] ease-premium group-hover:scale-[1.06] opacity-90 group-hover:opacity-100"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/20 to-transparent" />
                          
                          {/* Price Badge */}
                          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xl border border-white/[0.08] px-2.5 py-1.5 rounded-lg shadow-premium">
                            <p className="text-[#00ff00] font-black text-xs md:text-sm leading-none">
                              {paymentMethod === 'lyd' ? `${game.priceLYD} د.ل` : `${game.priceLibyana} رصيد`}
                            </p>
                          </div>

                          {/* Type Badge */}
                          <div className="absolute top-2.5 left-2.5 backdrop-blur-xl bg-orange-500/20 text-orange-300 border border-orange-500/20 px-2 py-1 rounded-md text-[9px] font-black">
                            👤 كامل
                          </div>
                        </div>

                        {/* Game Info */}
                        <div className="p-3 md:p-3.5 flex-1 flex flex-col justify-between">
                          <div className="mb-3">
                            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-1 group-hover:text-[#00ff00] transition-colors duration-300" dir="ltr">
                              {game.title}
                            </h3>
                            {"games" in game && Array.isArray((game as FullAccount).games) && (
                              <div className="flex flex-wrap gap-1 mt-1.5 mb-1.5">
                                {(game as FullAccount).games.map((g, gi) => (
                                  <span key={gi} className="text-[9px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/15" dir="ltr">
                                    {g}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-white/35 text-[10px] md:text-xs font-bold mt-1">
                              {game.titleAr}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(game)}
                            disabled={isAdded}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all duration-300 ease-premium ${
                              isAdded
                                ? "bg-green-600/15 text-green-400 border border-green-500/20"
                                : "bg-[#107C10]/15 text-[#00ff00] border border-[#107C10]/20 hover:bg-[#107C10] hover:text-white hover:shadow-[0_0_15px_rgba(16,124,16,0.45)] active:scale-[0.97]"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4" /> تم
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" /> للسلة
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </section>
        )}
      </div>
    </div>
  );
}
