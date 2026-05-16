import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import XboxSection from "@/components/XboxSection";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import CategorySheet from "@/components/CategorySheet";
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

        {/* Xbox Games & Accounts Section */}
        <div className="container mx-auto px-4 mt-6">
          <XboxSection />
        </div>
        
        {/* Placeholder spacer since we removed the grid */}
        <div className="h-12"></div>
      </main>

      <Footer />

      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Category Bottom Sheet */}
      <CategorySheet categories={categories} />
    </div>
  );
}
