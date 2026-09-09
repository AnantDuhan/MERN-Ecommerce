import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageSourcePropType } from "react-native";

import { useAuthStore } from "./auth.store";
import { CartRepository } from "@/features/cart/repositories/cart.repository";

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
  /** Login-time reconciliation: union-merges a server cart into this one. */
  mergeFromServer: (serverItems: CartItem[]) => void;
}

const sameLine = (a: CartItem, id: string, size?: string) =>
  a.id === id && a.size === size;

// Debounced push to the backend so the cart stays in sync across devices.
// Lives outside the store so it isn't itself part of persisted state.
let pushTimer: ReturnType<typeof setTimeout> | null = null;
function schedulePush(items: CartItem[]) {
  if (!useAuthStore.getState().isAuthenticated) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    CartRepository.sync(items).catch(() => {
      // Offline or request failed — local state (already persisted)
      // remains the source of truth until the next successful sync.
    });
  }, 800);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.id, item.size)
          );
          const items = existing
            ? state.items.map((i) =>
                sameLine(i, item.id, item.size)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...state.items, { ...item, quantity }];
          return { items };
        });
        schedulePush(get().items);
      },

      remove: (id, size) => {
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, id, size)),
        }));
        schedulePush(get().items);
      },

      setQuantity: (id, quantity, size) => {
        set((state) => ({
          items: state.items
            .map((i) => (sameLine(i, id, size) ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        }));
        schedulePush(get().items);
      },

      clear: () => {
        set({ items: [] });
        schedulePush([]);
      },

      mergeFromServer: (serverItems) => {
        set((state) => {
          const merged = state.items.map((i) => ({ ...i }));
          for (const serverItem of serverItems) {
            const index = merged.findIndex((i) =>
              sameLine(i, serverItem.id, serverItem.size)
            );
            if (index >= 0) {
              // Both devices added this line independently — combine them
              // rather than picking one arbitrarily.
              merged[index] = {
                ...merged[index],
                quantity: merged[index].quantity + serverItem.quantity,
              };
            } else {
              merged.push(serverItem);
            }
          }
          return { items: merged };
        });
        // Push the merged result back so the server reflects the union too.
        schedulePush(get().items);
      },
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
