import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getCategories } from "@/lib/products";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-navy">
      <Header categories={categories} />

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
          <ProductGrid categories={categories} />
        </section>
      </main>

      <Footer />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
