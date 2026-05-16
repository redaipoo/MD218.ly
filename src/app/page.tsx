import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import XboxSection from "@/components/XboxSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getCategories } from "@/lib/products";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-navy">
      {/* Red top accent bar */}
      <div className="w-full h-[3px]" style={{ background: "#cc0000" }} />

      <Header categories={categories} />

      <main className="pb-20 md:pb-0">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Section Title */}
        <section className="container mx-auto px-4 mt-8 mb-6">
          <h2 className="text-gold-gradient text-2xl md:text-3xl font-extrabold text-center md:text-right">
            اختر البطاقة التي تناسبك
          </h2>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4">
          <ProductGrid categories={categories} />
        </section>

        {/* Xbox Games & Accounts Section Moved to Bottom */}
        <div className="container mx-auto px-4 mt-12 mb-8">
          <XboxSection />
        </div>
      </main>

      <Footer />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
