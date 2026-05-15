"use client";

import Link from "next/link";
import type { Category } from "@/lib/products";

export default function ProductGrid({ categories = [] }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {categories.map((category, index) => {
        const totalDenominations = category.subCategories.reduce(
          (sum, sub) => sum + sub.denominations.length,
          0
        );
        return (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="group animate-fade-in"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-crimson/60 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-crimson/10">
              {/* Product Image - Large & Eye-catching */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* Actual product image as full background */}
                <img
                  src={category.productImageUrl}
                  alt={category.nameEn}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Subtle colored glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${category.gradient}`} />

                {/* Animated shine sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {/* Product name overlay at bottom */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg mb-1 drop-shadow-lg text-center">
                    {category.name}
                  </h3>
                  <p className="text-white/60 text-xs font-semibold tracking-widest uppercase text-center mb-2">
                    {category.nameEn}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] text-white/80 border border-white/10 font-medium">
                      {totalDenominations} منتج
                    </span>
                    <span className="inline-block px-3 py-1 bg-crimson/20 backdrop-blur-md rounded-full text-[11px] text-crimson-light border border-crimson/20 font-medium">
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
