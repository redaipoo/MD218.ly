"use client";

import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Section Title */}
        <section className="container mx-auto px-4 mt-8 mb-6">
          <h2 className="text-gold-gradient text-2xl md:text-3xl font-bold text-center md:text-right">
            اختر البطاقة التي تناسبك
          </h2>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4">
          <ProductGrid />
        </section>
      </main>

      <Footer />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
