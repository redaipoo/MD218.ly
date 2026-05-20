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
  loadCart: () => void;
}

const saveToStorage = (items: CartItem[], paymentMethod: PaymentMethod) => {
  if (typeof window === 'undefined') return;
  try {
    const data = {
      items,
      paymentMethod,
      savedAt: Date.now()
    };
    localStorage.setItem('md218-cart', JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save cart", e);
  }
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  paymentMethod: 'lyd',
  setPaymentMethod: (method) => {
    set({ paymentMethod: method });
    saveToStorage(get().items, method);
  },
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id && i.value === item.value);
      let newItems = [];
      if (existingItem) {
        newItems = state.items.map((i) =>
          i.id === item.id && i.value === item.value
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }
      saveToStorage(newItems, state.paymentMethod);
      return { items: newItems };
    }),
  removeItem: (id, value) =>
    set((state) => {
      const newItems = state.items.filter((i) => !(i.id === id && i.value === value));
      saveToStorage(newItems, state.paymentMethod);
      return { items: newItems };
    }),
  updateQuantity: (id, value, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id && i.value === value ? { ...i, quantity } : i
      );
      saveToStorage(newItems, state.paymentMethod);
      return { items: newItems };
    }),
  clearCart: () => {
    set({ items: [] });
    saveToStorage([], get().paymentMethod);
  },
  loadCart: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('md218-cart');
      if (stored) {
        const { items, savedAt, paymentMethod } = JSON.parse(stored);
        
        // Expiration check: 24 hours (24 * 60 * 60 * 1000 = 86400000 ms)
        const expirationTime = 24 * 60 * 60 * 1000; 
        if (Date.now() - savedAt > expirationTime) {
          localStorage.removeItem('md218-cart');
          return;
        }
        
        set({ 
          items: items || [], 
          paymentMethod: paymentMethod || 'lyd' 
        });
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }
}));
