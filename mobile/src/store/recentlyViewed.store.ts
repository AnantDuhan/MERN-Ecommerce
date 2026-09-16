import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageSourcePropType } from "react-native";

export interface RecentlyViewedItem {
  id: string;
  name: string;
  category: string;
  image: ImageSourcePropType;
  price: number;
  rating: number;
  reviews: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  record: (item: RecentlyViewedItem) => void;
  clear: () => void;
}

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      record: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.id !== item.id)].slice(
            0,
            MAX_ITEMS
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
