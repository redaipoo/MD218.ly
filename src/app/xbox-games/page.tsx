import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getCategories } from "@/lib/products";
import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import XboxGamesClient from "./XboxGamesClient";

export const metadata: Metadata = {
  title: "ألعاب Xbox الرقمية | MD218.LY",
  description:
    "تسوق ألعاب Xbox الرقمية بأفضل الأسعار في ليبيا. شراء في حسابك أو حسابات كاملة. اطلب الآن عبر واتساب!",
};

export default async function XboxGamesPage() {
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
            background: "linear-gradient(135deg, #107C10 0%, #0a3a0a 100%)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#00ff00]/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 left-10 w-56 h-56 bg-[#107C10]/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-[0.08]">
            <Gamepad2 className="w-48 h-48 md:w-72 md:h-72 text-white" />
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

            <Gamepad2 className="w-16 h-16 text-white/90 mb-4" />
            <h1
              className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-lg"
              style={{
                textShadow: "0 0 20px rgba(16,124,16,0.5)",
              }}
            >
              🎮 ألعاب Xbox الرقمية
            </h1>
            <p className="text-green-300/80 text-base md:text-xl max-w-xl mb-4">
              شراء في حسابك أو حسابات كاملة - أفضل الأسعار في ليبيا
            </p>
          </div>
        </div>

        {/* Games Content */}
        <XboxGamesClient />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
