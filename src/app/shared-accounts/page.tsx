import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getCategories } from "@/lib/products";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "حسابات Xbox المشتركة | MD218.LY",
  description:
    "حسابات Xbox مشتركة بأقل الأسعار. العب مع أصدقائك ووفر حتى 70%. اطلب الآن عبر واتساب!",
};

export default async function SharedAccountsPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Red top accent bar */}
      <div className="w-full h-[3px]" style={{ background: "#cc0000" }} />

      <Header categories={categories} />

      <main className="flex-grow pb-24 md:pb-12">
        {/* Hero Section */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            minHeight: "340px",
            background: "linear-gradient(135deg, #1a3a1a 0%, #0f2b0f 100%)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#00ff00]/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 left-10 w-56 h-56 bg-[#107C10]/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-[0.08]">
            <Users className="w-48 h-48 md:w-72 md:h-72 text-white" />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />

          {/* Content */}
          <div
            className="relative container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center"
            style={{ minHeight: "340px" }}
          >
            {/* Back Button */}
            <Link
              href="/"
              className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-white/30"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Link>

            <Users className="w-16 h-16 text-white/90 mb-4" />
            <h1
              className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-lg"
              style={{
                textShadow: "0 0 20px rgba(16,124,16,0.5)",
              }}
            >
              👥 حسابات Xbox المشتركة
            </h1>
            <p className="text-green-300/80 text-base md:text-xl max-w-xl mb-4">
              العب مع أصدقائك بأقل سعر - توفير حتى 70%
            </p>
            <span className="px-5 py-2 bg-[#0a3a0a]/80 backdrop-blur-md rounded-full text-white/80 text-sm font-bold border border-green-500/30">
              قريبًا سيتم إضافة الحسابات ⏳
            </span>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="container mx-auto px-4 mt-10">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="relative rounded-2xl overflow-hidden p-8 md:p-12"
              style={{
                background:
                  "linear-gradient(180deg, #0a1f0a 0%, #0d2b0d 100%)",
                border: "1px solid rgba(16,124,16,0.3)",
              }}
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#107C10]/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="text-6xl mb-6">👥</div>
                <h2
                  className="text-2xl md:text-3xl font-black text-white mb-4"
                  style={{
                    textShadow: "0 0 12px #107C10",
                  }}
                >
                  قريبًا... حسابات مشتركة بأسعار رائعة!
                </h2>
                <p className="text-green-300/60 text-sm md:text-base leading-relaxed mb-6">
                  نعمل على إضافة حسابات Xbox مشتركة تتيح لك اللعب مع أصدقائك
                  <br />
                  بأقل الأسعار الممكنة. ترقبوا التحديثات!
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-[#107C10]/20 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                    حسابات مشتركة 👥
                  </span>
                  <span className="px-4 py-2 bg-[#107C10]/20 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                    توفير حتى 70% 💰
                  </span>
                  <span className="px-4 py-2 bg-[#107C10]/20 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                    دعم فني متواصل 🛡️
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
