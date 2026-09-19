/** Payment-service env — Cashfree credentials live here and nowhere else. */
export const config = {
  port: Number(process.env.PORT ?? 4005),
  mongoUri: process.env.PAYMENT_MONGO_URI ?? "mongodb://mongo:27017/order-planning-payments",
  redisUrl: process.env.REDIS_URL ?? "redis://redis:6379",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  cashfree: {
    appId: process.env.CASHFREE_APP_ID ?? "",
    secretKey: process.env.CASHFREE_SECRET_KEY ?? "",
    environment: process.env.CASHFREE_ENVIRONMENT ?? "sandbox",
    apiVersion: "2025-01-01",
    timeoutMs: Number(process.env.CASHFREE_TIMEOUT_MS) || 15000,
    webhookUrl: process.env.CASHFREE_WEBHOOK_URL,
  },
};
