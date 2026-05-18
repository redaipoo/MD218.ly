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
      {/* Segmented Control Tabs */}
      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="flex justify-center">
          <div className="flex bg-navy-dark border border-white/10 p-1.5 rounded-full shadow-2xl overflow-x-auto custom-scrollbar w-full max-w-2xl">
            <button
              onClick={() => setActiveTab("cards")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm md:text-base font-black transition-all duration-300 whitespace-nowrap ${
                activeTab === "cards"
                  ? "bg-crimson text-white shadow-lg shadow-crimson/30 transform scale-[1.02]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              البطاقات
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm md:text-base font-black transition-all duration-300 whitespace-nowrap ${
                activeTab === "accounts"
                  ? "bg-crimson text-white shadow-lg shadow-crimson/30 transform scale-[1.02]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              حسابات مشتركة
            </button>
            <button
              onClick={() => setActiveTab("games")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm md:text-base font-black transition-all duration-300 whitespace-nowrap ${
                activeTab === "games"
                  ? "bg-crimson text-white shadow-lg shadow-crimson/30 transform scale-[1.02]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Gamepad2 className="w-4 h-4 md:w-5 md:h-5" />
              ألعاب رقمية
            </button>
          </div>
        </div>
      </div>

      {/* Content Area with smooth fade transition */}
      <div className="transition-opacity duration-500 ease-in-out">
        {activeTab === "cards" && (
          <section className="container mx-auto px-4 animate-fade-in">
            <ProductGrid categories={categories} />
          </section>
        )}

        {activeTab === "accounts" && (
          <section className="container mx-auto px-4 animate-fade-in mt-4">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ textShadow: "0 0 15px rgba(16,124,16,0.5)" }}>
                حسابات ألعاب مشتركة
              </h2>
              <p className="text-white/60 text-center max-w-lg">
                استمتع بأفضل الألعاب بأقل الأسعار! حسابات أصلية ومضمونة للعب أوفلاين.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sharedAccounts.map((game, idx) => {
                const isAdded = addedItems.has(game.id);
                return (
                  <div
                    key={game.id}
                    className="group bg-navy-light rounded-2xl border border-white/5 hover:border-[#107C10]/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#107C10]/20 flex flex-col"
                  >
                    {/* Game Cover */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-black/50">
                      <img
                        src={assetPath(game.image)}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/20 to-transparent" />
                      
                      {/* Price Badge Overlay */}
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                        <p className="text-[#00ff00] font-black text-xs md:text-sm">
                          {paymentMethod === 'lyd' ? `${game.priceLYD} د.ل` : `${game.priceLibyana} رصيد`}
                        </p>
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/40">
                      <div>
                        <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-1 group-hover:text-[#00ff00] transition-colors" dir="ltr">
                          {game.title}
                        </h3>
                        <p className="text-white/40 text-[10px] md:text-xs mb-3 font-bold">{game.titleAr}</p>
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(game)}
                        disabled={isAdded}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
                          isAdded
                            ? "bg-green-600/20 text-green-400 border border-green-500/30"
                            : "bg-[#107C10]/20 text-[#00ff00] border border-[#107C10]/30 hover:bg-[#107C10] hover:text-white"
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
          <section className="container mx-auto px-4 animate-fade-in mt-4">
            <div className="max-w-2xl mx-auto text-center">
              <div
                className="relative rounded-3xl overflow-hidden p-8 md:p-14 shadow-2xl"
                style={{
                  background: "linear-gradient(180deg, #0a1f0a 0%, #050f05 100%)",
                  border: "1px solid rgba(16,124,16,0.3)",
                }}
              >
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#107C10]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="w-20 h-20 bg-[#107C10]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#107C10]/20 shadow-[0_0_30px_rgba(16,124,16,0.2)]">
                    <Gamepad2 className="w-10 h-10 text-[#00ff00]" />
                  </div>
                  <h2
                    className="text-2xl md:text-4xl font-black text-white mb-4"
                    style={{ textShadow: "0 0 15px rgba(16,124,16,0.5)" }}
                  >
                    قريباً... ألعاب بأسعار خيالية!
                  </h2>
                  <p className="text-white/60 text-sm md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
                    نعمل على إضافة مجموعة ضخمة من الألعاب الرقمية لمنصة Xbox
                    بأسعار تنافسية وتفعيل فوري.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-5 py-2.5 bg-[#107C10]/20 text-[#00ff00] text-xs font-bold rounded-xl border border-[#107C10]/30 shadow-inner">
                      ألعاب حصرية 🔥
                    </span>
                    <span className="px-5 py-2.5 bg-[#107C10]/20 text-[#00ff00] text-xs font-bold rounded-xl border border-[#107C10]/30 shadow-inner">
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
