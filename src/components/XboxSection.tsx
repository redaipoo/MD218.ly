"use client";

import Link from "next/link";
import { Gamepad2, Users } from "lucide-react";

export default function XboxSection() {
  return (
    <section
      id="xbox-section"
      className="relative py-10 md:py-14 my-6"
      style={{
        background: "linear-gradient(180deg, #0a1f0a 0%, #0d2b0d 100%)",
        border: "1px solid #107C10",
        boxShadow: "0 0 20px rgba(16,124,16,0.3)",
        borderRadius: "20px",
      }}
    >
      {/* Pulsing "NEW" badge */}
      <div
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 animate-xbox-pulse"
        style={{ color: "#00ff00" }}
      >
        <span className="bg-[#00ff00]/20 text-[#00ff00] text-xs md:text-sm font-black px-3 py-1.5 rounded-full border border-[#00ff00]/50">
          🔥 جديد
        </span>
      </div>

      {/* Decorative glows */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-[#107C10]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-[#107C10]/8 rounded-full blur-3xl" />

      {/* Section Title */}
      <div className="container mx-auto px-4">
        <h2
          className="text-center text-2xl md:text-3xl font-black text-white mb-8 md:mb-10"
          style={{ textShadow: "0 0 12px #107C10, 0 0 30px rgba(16,124,16,0.3)" }}
        >
          🎮 ألعاب وحسابات Xbox
        </h2>

        {/* Two Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Card 1 - Xbox Digital Games */}
          <Link href="/category/xbox" className="block group">
            <div
              className="relative overflow-hidden cursor-pointer transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_0_30px_rgba(16,124,16,0.5)]"
              style={{
                background: "linear-gradient(135deg, #107C10, #0a5a0a)",
                borderRadius: "16px",
                padding: "24px 16px",
                border: "1px solid rgba(16,124,16,0.6)",
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative flex flex-col items-center text-center gap-3">
                {/* Xbox Icon */}
                <div className="w-[60px] h-[60px] flex items-center justify-center mb-1">
                  <Gamepad2 className="w-14 h-14 text-white" />
                </div>

                <h3 className="text-white font-bold text-lg">ألعاب Xbox الرقمية</h3>
                <p className="text-green-300/80 text-[13px]">مفاتيح رقمية - تفعيل فوري</p>

                {/* Badge */}
                <span className="mt-2 px-4 py-1.5 bg-[#0a3a0a] text-white text-xs font-bold rounded-full border border-green-500/30">
                  متوفر الآن ✅
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2 - Xbox Shared Accounts */}
          <Link href="/category/gamepass" className="block group">
            <div
              className="relative overflow-hidden cursor-pointer transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_0_30px_rgba(16,124,16,0.5)]"
              style={{
                background: "linear-gradient(135deg, #1a3a1a, #0f2b0f)",
                borderRadius: "16px",
                padding: "24px 16px",
                border: "1px solid rgba(16,124,16,0.6)",
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative flex flex-col items-center text-center gap-3">
                {/* Users Icon */}
                <div className="w-[60px] h-[60px] flex items-center justify-center mb-1">
                  <Users className="w-14 h-14 text-white" />
                </div>

                <h3 className="text-white font-bold text-lg">حسابات Xbox مشتركة</h3>
                <p className="text-green-300/80 text-[13px]">العب مع أصدقائك بأقل سعر</p>

                {/* Badge */}
                <span className="mt-2 px-4 py-1.5 bg-[#0a3a0a] text-white text-xs font-bold rounded-full border border-green-500/30">
                  توفير حتى 70% 💰
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
