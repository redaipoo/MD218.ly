import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import HomeTabs from "@/components/HomeTabs";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getCategories } from "@/lib/products";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-navy">
      {/* Red top accent bar — premium gradient */}
      <div className="w-full h-[3px] bg-gradient-to-r from-crimson-dark via-crimson to-crimson-dark" />

      <Header categories={categories} />

      <main className="pb-24 md:pb-0">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Section Title — premium typography */}
        <section className="container mx-auto px-4 mt-6 md:mt-8 mb-4 md:mb-6">
          <h2 className="text-gold-gradient text-2xl md:text-3xl font-black text-center md:text-right leading-relaxed">
            اختر البطاقة التي تناسبك
          </h2>
          <div className="flex justify-center md:justify-start mt-3">
            <div className="w-16 h-0.5 bg-gradient-to-r from-crimson to-transparent rounded-full" />
          </div>
        </section>

        {/* Unified Tabbed Interface for Cards, Accounts, and Games */}
        <HomeTabs categories={categories} />
      </main>

      <Footer />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
