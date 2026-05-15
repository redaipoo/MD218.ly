import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  region?: string;
  value: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, value: string) => void;
  updateQuantity: (id: string, value: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
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
}));
