import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  region?: string;
  value: string;
  quantity: number;
  priceLYD: number;
  priceLibyana: number;
}

export type PaymentMethod = 'lyd' | 'libyana';

interface CartStore {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, value: string) => void;
  updateQuantity: (id: string, value: string, quantity: number) => void;
  clearCart: () => void;
  // Product Catalog Hydration
  categories: any[];
  isCategoriesLoading: boolean;
  fetchCategories: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  paymentMethod: 'lyd',
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id && i.value === item.value);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.value === item.value
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id, value) =>
    set((state) => ({
      items: state.items.filter((i) => !(i.id === id && i.value === value)),
    })),
  updateQuantity: (id, value, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id && i.value === value ? { ...i, quantity } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
  // Product Catalog Hydration
  categories: [],
  isCategoriesLoading: false,
  fetchCategories: async () => {
    set({ isCategoriesLoading: true });
    try {
      // Fetch latest JSON directly from GitHub Raw to bypass Netlify static cache completely
      // raw.githubusercontent has no strict rate limit compared to api.github.com (60/hr)
      // We add a timestamp to bypass browser caching, though GitHub CDN may still cache for ~1-5 mins.
      const timestamp = new Date().getTime();
      const res = await fetch(`https://raw.githubusercontent.com/redaipoo/MD.LY/main/src/data/categories.json?t=${timestamp}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        set({ categories: data, isCategoriesLoading: false });
      } else {
        set({ isCategoriesLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch fresh categories", error);
      set({ isCategoriesLoading: false });
    }
  },
}));
