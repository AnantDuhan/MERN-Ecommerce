/** All env reads for auth-service, typed and defaulted in one place. */
export const config = {
  port: Number(process.env.PORT ?? 4001),
  mongoUri:
    process.env.AUTH_MONGO_URI ?? "mongodb://mongo:27017/order-planning-auth",
  redisUrl: process.env.REDIS_URL ?? "redis://redis:6379",
  // Same secret the gateway verifies with and the monolith already uses.
  jwtSecret: process.env.JWT_SECRET_KEY ?? "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "90d",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  isProd: process.env.NODE_ENV === "production",
};
