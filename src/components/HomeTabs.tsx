"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import { Gamepad2, Users, CreditCard } from "lucide-react";
import type { Category } from "@/lib/products";

type TabId = "cards" | "accounts" | "games";

export default function HomeTabs({ categories }: { categories: Category[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("cards");

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
                    <Users className="w-10 h-10 text-[#00ff00]" />
                  </div>
                  <h2
                    className="text-2xl md:text-4xl font-black text-white mb-4"
                    style={{ textShadow: "0 0 15px rgba(16,124,16,0.5)" }}
                  >
                    قريباً... حسابات مشتركة!
                  </h2>
                  <p className="text-white/60 text-sm md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
                    نعمل على إضافة حسابات Xbox مشتركة تتيح لك اللعب مع أصدقائك
                    بأقل الأسعار الممكنة. ترقبوا التحديثات!
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-5 py-2.5 bg-[#107C10]/20 text-[#00ff00] text-xs font-bold rounded-xl border border-[#107C10]/30 shadow-inner">
                      حسابات أصلية 👥
                    </span>
                    <span className="px-5 py-2.5 bg-[#107C10]/20 text-[#00ff00] text-xs font-bold rounded-xl border border-[#107C10]/30 shadow-inner">
                      توفير حتى 70% 💰
                    </span>
                  </div>
                </div>
              </div>
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
