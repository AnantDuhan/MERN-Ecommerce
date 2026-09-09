export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
    UPDATE_PASSWORD: "/auth/password/update",
    GOOGLE_LOGIN: "/auth/google-login",
  },

  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/product/${id}`,
    REVIEWS: "/reviews",
  },

  WISHLIST: {
    LIST: "/wishlist",
    ITEM: (id: string) => `/wishlist/${id}`,
  },

  ORDERS: {
    CREATE: "/order/new",
    MINE: "/orders/me",
    DETAIL: (id: string) => `/order/${id}`,
    RETURN: (id: string) => `/order/${id}/return`,
  },

  PAYMENT: {
    PROCESS: "/payment",
    STRIPE_KEY: "/stripeapikey",
  },
} as const;
