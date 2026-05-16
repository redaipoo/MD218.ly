// Types are defined below

export interface Denomination {
  value: string;
  label: string;
  priceLYD?: number;
  priceLibyana?: number;
}

export interface SubCategory {
  id: string;
  region: string;
  currency: string;
  denominations: Denomination[];
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  gradient: string;
  icon: string;
  logoUrl: string;
  productImageUrl: string;
  bgUrl: string;
  subCategories: SubCategory[];
}

import localCategories from '@/data/categories.json';

export const defaultCategories: Category[] = localCategories as Category[];

export async function getCategories(): Promise<Category[]> {
  return defaultCategories;
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const cats = await getCategories();
  return cats.find((c) => c.id === id);
}
