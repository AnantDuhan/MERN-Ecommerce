/** Search-service env. It holds no database — only an Elasticsearch node and the
 *  catalog URL it backfills from. */
export const config = {
  port: Number(process.env.PORT ?? 4003),
  redisUrl: process.env.REDIS_URL ?? "redis://redis:6379",
  esNode: process.env.ELASTICSEARCH_NODE ?? "http://elasticsearch:9200",
  esApiKey: process.env.ELASTICSEARCH_API_KEY,
  esUsername: process.env.ELASTICSEARCH_USERNAME,
  esPassword: process.env.ELASTICSEARCH_PASSWORD,
  catalogServiceUrl: process.env.CATALOG_SERVICE_URL ?? "http://catalog-service:4002",
};
