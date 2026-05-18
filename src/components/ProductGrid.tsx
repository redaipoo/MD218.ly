"use client";

import Link from "next/link";
import type { Category } from "@/lib/products";
import { assetPath } from "@/lib/utils";

// Map category IDs to brand accent colors
const brandAccents: Record<string, string> = {
  xbox: "#107C10",
  playstation: "#003087",
  apple: "#A2AAAD",
  steam: "#1b2838",
  pubg: "#F2A900",
  gamepass: "#107C10",
  shahid: "#3DB548",
  razer: "#44D62C",
  netflix: "#E50914",
  shein: "#000000",
};

export default function ProductGrid({ categories = [] }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 pb-8 stagger-grid">
      {categories.map((category) => {
        const totalDenominations = category.subCategories.reduce(
          (sum, sub) => sum + sub.denominations.length,
          0
        );
        const accentColor = brandAccents[category.id] || "#cc0000";

        return (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="group"
          >
            <div
              className="relative bg-card overflow-hidden border border-white/[0.06] hover:border-crimson/40 transition-all duration-[400ms] ease-premium hover:-translate-y-1.5 hover:shadow-premium-lg"
              style={{
                borderRadius: "20px",
                borderTop: `3px solid ${accentColor}`,
              }}
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={assetPath(category.productImageUrl)}
                  alt={category.nameEn}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.08]"
                  loading="lazy"
                />

                {/* 3-stop gradient overlay for smooth readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/5" />

                {/* Subtle colored glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 ease-smooth bg-gradient-to-br ${category.gradient}`} />

                {/* Animated shine sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-premium bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Inner shadow for depth */}
                <div className="absolute inset-0 shadow-[inset_0_-40px_40px_-20px_rgba(0,0,0,0.5)]" />

                {/* Product name overlay at bottom */}
                <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
                  <h3 className="text-white font-black text-base md:text-lg mb-1.5 drop-shadow-lg text-center leading-snug">
                    {category.name}
                  </h3>
                  <p className="text-white/50 text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-center mb-3">
                    {category.nameEn}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/[0.08] backdrop-blur-md rounded-full text-[10px] md:text-[11px] text-white/75 border border-white/[0.08] font-semibold">
                      {totalDenominations} منتج
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 bg-crimson/15 backdrop-blur-md rounded-full text-[10px] md:text-[11px] text-crimson-light border border-crimson/15 font-semibold">
                      {category.subCategories.length} منطقة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
