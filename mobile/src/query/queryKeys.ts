export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "current-user"] as const,
  },

  PRODUCTS: {
    ALL: ["products"] as const,
    FLASH_SALE: ["products", "flash-sale"] as const,
    FEATURED: ["products", "featured"] as const,
    DETAIL: (id: string) => ["products", "detail", id] as const,
    CATEGORY: (categoryId: string) =>
      ["products", "category", categoryId] as const,
    SEARCH: (query: string) => ["products", "search", query] as const,
  },

  CATEGORIES: {
    ALL: ["categories"] as const,
  },

  CART: {
    ALL: ["cart"] as const,
  },

  WISHLIST: {
    ALL: ["wishlist"] as const,
  },

  ORDERS: {
    ALL: ["orders"] as const,

    DETAIL: (id: string) => ["orders", id] as const,
  },

  PROFILE: {
    DETAILS: ["profile"] as const,
  },
} as const;
