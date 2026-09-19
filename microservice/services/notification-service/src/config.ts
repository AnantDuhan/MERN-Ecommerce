/** All environment reads live here so the rest of the service imports typed values. */
export const config = {
  port: Number(process.env.PORT ?? 4006),
  mongoUri:
    process.env.NOTIFICATION_MONGO_URI ??
    "mongodb://mongo:27017/order-planning-notifications",
  redisUrl: process.env.REDIS_URL ?? "redis://redis:6379",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM_EMAIL ?? "Maison <hello@example.com>",
};
