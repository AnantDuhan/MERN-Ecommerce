import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      networkMode: "online",
    },

    mutations: {
      retry: 1,
      networkMode: "online",
    },
  },
});

export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"] as const,
  },

  PRODUCTS: {
    ALL: ["products"] as const,
    FLASH_SALE: ["products", "flash-sale"] as const,
    FEATURED: ["products", "featured"] as const,
    DETAIL: (id: string) => ["products", id] as const,
  },

  CART: {
    ALL: ["cart"] as const,
  },

  WISHLIST: {
    ALL: ["wishlist"] as const,
  },
};