import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  receivedAt: string;
  read: boolean;
}

interface NotificationsState {
  items: AppNotification[];
  add: (n: Omit<AppNotification, "id" | "receivedAt" | "read">) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      items: [],
      add: (n) =>
        set((state) => ({
          items: [
            {
              ...n,
              id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
              receivedAt: new Date().toISOString(),
              read: false,
            },
            ...state.items,
          ].slice(0, 100), // cap history
        })),
      markAllRead: () =>
        set((state) => ({
          items: state.items.map((i) => ({ ...i, read: true })),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "notifications",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const selectUnreadCount = (s: NotificationsState) =>
  s.items.filter((i) => !i.read).length;
