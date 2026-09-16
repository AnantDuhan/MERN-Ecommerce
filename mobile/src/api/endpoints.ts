export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/password/forgot",
    RESET_PASSWORD: "/password/reset",
    ME: "/auth/me",
    UPDATE_PASSWORD: "/password/update",
    UPDATE_PROFILE: "/me/update",
    GOOGLE_LOGIN: "/auth/google",
  },

  ADDRESSES: {
    LIST: "/addresses",
    CREATE: "/address/new",
    DELETE: (id: string) => `/address/${id}`,
  },

  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/product/${id}`,
  },

  REVIEWS: {
    LIST: "/reviews", // ?id=productId
    CREATE: "/review",
    DELETE: (reviewId: string) => `/review/${reviewId}`, // ?id=productId
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
    REORDER: (id: string) => `/order/reorder/${id}`,
  },

  COUPONS: {
    LIST: "/coupons/all",
  },

  PAYMENT: {
    CASHFREE_CREATE_ORDER: "/cashfree/order",
    CASHFREE_VERIFY: (orderId: string) => `/cashfree/order/${orderId}/verify`,
  },

  ADMIN: {
    STATS: "/admin/stats",
    ANALYTICS: "/admin/analytics",

    PRODUCTS: "/admin/products",
    PRODUCT_CREATE: "/admin/product/new",
    PRODUCT_UPDATE: (id: string) => `/admin/update/product/${id}`,
    PRODUCT_DELETE: (id: string) => `/admin/product/${id}`,

    ORDERS: "/admin/orders",
    ORDER_UPDATE: (id: string) => `/admin/order/${id}`,
    ORDER_DELETE: (id: string) => `/admin/order/${id}`,
    ORDER_REFUND: (id: string) => `/admin/order/${id}/refund`,
    REFUND_STATUS: (orderId: string, refundId: string) =>
      `/admin/order/${orderId}/refund/${refundId}/status`,

    RETURNS: "/admin/returns",
    RETURN_STATUS: (id: string) => `/admin/return/${id}/status`,

    REFUNDS: "/admin/refunds",

    USERS: "/auth/admin/users",
    USER_DETAIL: (id: string) => `/auth/admin/user/${id}`,
    USER_ROLE_UPDATE: (id: string) => `/auth/admin/user/${id}`,
    USER_DELETE: (id: string) => `/auth/admin/user/${id}`,
  },

  MEMBERSHIP: {
    PLANS: "/membership/plans",
    CURRENT: "/membership/current",
    CREATE: "/membership",
    STATUS: (subscriptionId: string) => `/membership/${subscriptionId}`,
    CANCEL: (subscriptionId: string) => `/membership/${subscriptionId}/cancel`,
  },

  BANNERS: {
    LIST: "/banners",
  },

  CART: {
    GET: "/cart",
    SYNC: "/cart",
  },

  CONTACT: {
    SEND: "/contact-us",
  },

  NEWSLETTER: {
    SUBSCRIBE: "/subscribe",
    UNSUBSCRIBE: (token: string) => `/unsubscribe/${token}`,
  },
} as const;
