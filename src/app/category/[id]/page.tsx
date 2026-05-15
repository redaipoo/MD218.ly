import type { Metadata } from "next";
import { categories, getCategoryById } from "@/lib/products";
import CategoryPageClient from "./CategoryPageClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// Pre-generate all 10 category pages at build time
export function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }));
}

// Dynamic SEO metadata per category
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);

  if (!category) {
    return {
      title: "القسم غير موجود | MD.LY",
    };
  }

  const totalProducts = category.subCategories.reduce(
    (s, sub) => s + sub.denominations.length,
    0
  );

  return {
    title: `${category.name} - ${category.nameEn} | MD.LY`,
    description: `اشترِ بطاقات ${category.name} (${category.nameEn}) بأسعار منافسة. ${totalProducts} فئة متوفرة. اطلب فوراً عبر واتساب!`,
    openGraph: {
      title: `${category.name} | MD.LY`,
      description: `بطاقات ${category.name} - ${totalProducts} منتج متوفر`,
      type: "website",
      locale: "ar_LY",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = getCategoryById(id);

  if (!category) {
    return (
      <div className="min-h-screen bg-navy flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">😕</p>
            <h1 className="text-white text-2xl font-bold mb-2">القسم غير موجود</h1>
            <Link href="/" className="text-crimson-light hover:text-white transition-colors">
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <CategoryPageClient category={category} />;
}
