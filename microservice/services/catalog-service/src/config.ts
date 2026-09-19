/** Catalog-service env, typed and defaulted in one place. */
export const config = {
  port: Number(process.env.PORT ?? 4002),
  mongoUri:
    process.env.CATALOG_MONGO_URI ?? "mongodb://mongo:27017/order-planning-catalog",
  redisUrl: process.env.REDIS_URL ?? "redis://redis:6379",
  resultPerPage: Number(process.env.RESULT_PER_PAGE ?? 12),
  listCacheTtl: Number(process.env.LIST_CACHE_TTL ?? 60),
};
