/** Analytics-service env. */
export const config = {
  port: Number(process.env.PORT ?? 4007),
  mongoUri: process.env.ANALYTICS_MONGO_URI ?? "mongodb://mongo:27017/order-planning-analytics",
  redisUrl: process.env.REDIS_URL ?? "redis://redis:6379",
};
