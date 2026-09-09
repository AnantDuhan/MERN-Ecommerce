import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageSourcePropType } from "react-native";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: ImageSourcePropType;
  size?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (id: string, size?: string) => void;
  setQuantity: (id: string, quantity: number, size?: string) => void;
  clear: () => void;
}

const sameLine = (a: CartItem, id: string, size?: string) =>
  a.id === id && a.size === size;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.id, item.size)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.id, item.size)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      remove: (id, size) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, id, size)),
        })),

      setQuantity: (id, quantity, size) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              sameLine(i, id, size) ? { ...i, quantity } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Derived selectors
export const selectCartCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);

export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
