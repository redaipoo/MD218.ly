"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import { Gamepad2, Users, CreditCard, Plus, Check } from "lucide-react";
import type { Category } from "@/lib/products";
import sharedAccounts from "@/data/shared-accounts.json";
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
}

export default function HomeTabs({ categories }: { categories: Category[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("cards");
  const addItem = useCartStore((s) => s.addItem);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

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
                استمتع بأفضل الألعاب بأقل الأسعار! حسابات أصلية ومضمونة للعب أوفلاين.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 stagger-grid">
              {sharedAccounts.map((game) => {
                const isAdded = addedItems.has(game.id);
                return (
                  <div
                    key={game.id}
                    className="group bg-navy-light/80 rounded-2xl border border-white/[0.05] hover:border-[#107C10]/40 overflow-hidden transition-all duration-[400ms] ease-premium hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(16,124,16,0.15)] flex flex-col"
                  >
                    {/* Game Cover */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-black/50">
                      <img
                        src={assetPath(game.image)}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-[600ms] ease-premium group-hover:scale-[1.06] opacity-90 group-hover:opacity-100"
                        loading="lazy"
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
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ease-premium ${
                          isAdded
                            ? "bg-green-600/15 text-green-400 border border-green-500/20"
                            : "bg-[#107C10]/15 text-[#00ff00] border border-[#107C10]/20 hover:bg-[#107C10] hover:text-white hover:shadow-glow-green active:scale-[0.97]"
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
          <section className="container mx-auto px-4 animate-fade-in-scale mt-4">
            <div className="max-w-2xl mx-auto text-center">
              <div
                className="relative rounded-3xl overflow-hidden p-10 md:p-16 shadow-premium-lg"
                style={{
                  background: "linear-gradient(180deg, #0a1f0a 0%, #050f05 100%)",
                  border: "1px solid rgba(16,124,16,0.2)",
                }}
              >
                {/* Glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#107C10]/10 rounded-full blur-3xl pointer-events-none animate-ambient" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#107C10]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="w-20 h-20 bg-[#107C10]/10 rounded-2xl flex items-center justify-center mx-auto mb-7 border border-[#107C10]/15 shadow-[0_0_40px_rgba(16,124,16,0.15)]">
                    <Gamepad2 className="w-10 h-10 text-[#00ff00]" />
                  </div>
                  <h2
                    className="text-2xl md:text-4xl font-black text-white mb-5"
                    style={{ textShadow: "0 0 20px rgba(16,124,16,0.4)" }}
                  >
                    قريباً... ألعاب بأسعار خيالية!
                  </h2>
                  <p className="text-white/50 text-sm md:text-lg leading-relaxed mb-9 max-w-md mx-auto">
                    نعمل على إضافة مجموعة ضخمة من الألعاب الرقمية لمنصة Xbox
                    بأسعار تنافسية وتفعيل فوري.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-5 py-2.5 bg-[#107C10]/15 text-[#00ff00] text-xs font-bold rounded-xl border border-[#107C10]/20">
                      ألعاب حصرية 🔥
                    </span>
                    <span className="px-5 py-2.5 bg-[#107C10]/15 text-[#00ff00] text-xs font-bold rounded-xl border border-[#107C10]/20">
                      تفعيل فوري ⚡
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
