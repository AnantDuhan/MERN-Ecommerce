/** Order-service env. */
export const config = {
  port: Number(process.env.PORT ?? 4004),
  mongoUri: process.env.ORDER_MONGO_URI ?? "mongodb://mongo:27017/order-planning-orders",
  redisUrl: process.env.REDIS_URL ?? "redis://redis:6379",
  authServiceUrl: process.env.AUTH_SERVICE_URL ?? "http://auth-service:4001",
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL ?? "http://payment-service:4005",
};
