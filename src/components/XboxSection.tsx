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
          <Link href="/xbox-games" className="block group">
            <div
              className="relative overflow-hidden cursor-pointer transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_0_25px_rgba(16,124,16,0.2)] bg-[#050505]"
              style={{
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(16,124,16,0.3)",
              }}
            >
              {/* Green accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#107C10] to-[#00ff00]/50" />

              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <div className="relative flex flex-col items-center text-center gap-3">
                {/* Xbox Icon */}
                <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#107C10]/10 rounded-full border border-[#107C10]/20 mb-1 group-hover:bg-[#107C10]/20 transition-colors">
                  <Gamepad2 className="w-8 h-8 text-[#00ff00]" />
                </div>

                <h3 className="text-white font-bold text-xl">ألعاب Xbox الرقمية</h3>
                <p className="text-white/60 text-[14px] max-w-[250px]">مفاتيح رقمية بتفعيل فوري لأحدث ألعاب الإكس بوكس</p>

                {/* Call to Action Button */}
                <div className="mt-3 w-full py-2.5 bg-[#107C10]/20 text-[#00ff00] text-sm font-bold rounded-xl border border-[#107C10]/40 group-hover:bg-[#107C10] group-hover:text-white transition-all">
                  تصفح الألعاب ←
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2 - Xbox Shared Accounts */}
          <Link href="/shared-accounts" className="block group">
            <div
              className="relative overflow-hidden cursor-pointer transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_0_25px_rgba(16,124,16,0.2)] bg-[#050505]"
              style={{
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(16,124,16,0.3)",
              }}
            >
              {/* Green accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#107C10] to-[#00ff00]/50" />

              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <div className="relative flex flex-col items-center text-center gap-3">
                {/* Users Icon */}
                <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#107C10]/10 rounded-full border border-[#107C10]/20 mb-1 group-hover:bg-[#107C10]/20 transition-colors">
                  <Users className="w-8 h-8 text-[#00ff00]" />
                </div>

                <h3 className="text-white font-bold text-xl">حسابات مشتركة</h3>
                <p className="text-white/60 text-[14px] max-w-[250px]">العب مع أصدقائك بأقل الأسعار الممكنة والتوفير</p>

                {/* Call to Action Button */}
                <div className="mt-3 w-full py-2.5 bg-[#107C10]/20 text-[#00ff00] text-sm font-bold rounded-xl border border-[#107C10]/40 group-hover:bg-[#107C10] group-hover:text-white transition-all">
                  اشترك الآن ←
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
