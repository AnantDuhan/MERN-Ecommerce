import type { ProductIndexDoc } from "@order-planning/shared";
import { createLogger } from "@order-planning/shared";
import { esClient, PRODUCT_INDEX } from "./esClient";
import { config } from "./config";

const log = createLogger("search-service");

/**
 * Ported from the monolith's services/searchService.js. The one structural
 * change: the monolith's bulkReindex read Product straight from Mongo. Search no
 * longer owns product data, so steady-state indexing is driven by the Product
 * events (see consumers/), and the backfill (reindexFromCatalog) pulls over HTTP
 * from catalog-service instead of touching its database.
 */
const INDEX_DEFINITION = {
  mappings: {
    properties: {
      name: {
        type: "text" as const,
        fields: {
          keyword: { type: "keyword" as const },
          suggest: { type: "search_as_you_type" as const },
        },
      },
      description: { type: "text" as const },
      category: { type: "keyword" as const },
      price: { type: "float" as const },
      ratings: { type: "float" as const },
      numOfReviews: { type: "integer" as const },
      Stock: { type: "integer" as const },
      images: { type: "object" as const, enabled: false },
      createdAt: { type: "date" as const },
    },
  },
};

export async function ensureIndex(): Promise<void> {
  const exists = await esClient.indices.exists({ index: PRODUCT_INDEX });
  if (!exists) {
    await esClient.indices.create({ index: PRODUCT_INDEX, ...INDEX_DEFINITION });
    log.info({ index: PRODUCT_INDEX }, "elasticsearch index created");
  }
}

export async function indexProduct(id: string, doc: ProductIndexDoc): Promise<void> {
  await esClient.index({ index: PRODUCT_INDEX, id, document: doc });
}

export async function deleteProductDoc(id: string): Promise<void> {
  try {
    await esClient.delete({ index: PRODUCT_INDEX, id });
  } catch (e) {
    if ((e as { meta?: { statusCode?: number } })?.meta?.statusCode === 404) return;
    throw e;
  }
}

export interface SearchParams {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function searchProducts(params: SearchParams) {
  const size = Number(params.limit) || 12;
  const from = (Math.max(1, Number(params.page) || 1) - 1) * size;

  const must: unknown[] = [];
  if (params.keyword && params.keyword.trim()) {
    must.push({
      multi_match: {
        query: params.keyword,
        fields: ["name^3", "name.suggest^2", "description", "category^2"],
        fuzziness: "AUTO",
        prefix_length: 1,
        operator: "or",
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  const filter: unknown[] = [];
  if (params.category) filter.push({ term: { category: params.category } });
  if (params.minPrice != null || params.maxPrice != null) {
    const range: Record<string, number> = {};
    if (params.minPrice != null) range.gte = Number(params.minPrice);
    if (params.maxPrice != null) range.lte = Number(params.maxPrice);
    filter.push({ range: { price: range } });
  }
  if (params.inStock) filter.push({ range: { Stock: { gt: 0 } } });

  const sortClause: unknown[] = [];
  if (params.sort === "price_asc") sortClause.push({ price: "asc" });
  else if (params.sort === "price_desc") sortClause.push({ price: "desc" });
  else if (params.sort === "ratings") sortClause.push({ ratings: "desc" });

  const resp = await esClient.search({
    index: PRODUCT_INDEX,
    from,
    size,
    query: { bool: { must, filter } } as never,
    ...(sortClause.length ? { sort: sortClause as never } : {}),
  });

  const products = resp.hits.hits.map((h) => ({ _id: h._id, ...(h._source as object), _score: h._score }));
  const total = typeof resp.hits.total === "object" ? resp.hits.total?.value : resp.hits.total;
  return { products, total };
}

export async function suggestProducts(query: string, limit = 6) {
  if (!query || !query.trim()) return [];
  const resp = await esClient.search({
    index: PRODUCT_INDEX,
    size: Number(limit) || 6,
    query: {
      multi_match: {
        query,
        type: "bool_prefix",
        fields: ["name.suggest", "name.suggest._2gram", "name.suggest._3gram"],
      },
    } as never,
    _source: ["name", "category", "price", "images"],
  });
  return resp.hits.hits.map((h) => ({ id: h._id, _id: h._id, ...(h._source as object) }));
}

/**
 * Backfill: page through catalog-service's product list and bulk-index. Used for
 * first-time indexing or recovery; steady state is event-driven. Paging past the
 * first page is a documented TODO — catalog would expose an internal export or
 * accept a page cursor.
 */
export async function reindexFromCatalog(): Promise<{ indexed: number }> {
  await ensureIndex();
  const res = await fetch(`${config.catalogServiceUrl}/api/v1/products?limit=1000`);
  if (!res.ok) throw new Error(`catalog fetch failed: ${res.status}`);
  const body = (await res.json()) as { products: Array<{ _id: string } & ProductIndexDoc> };
  if (!body.products?.length) return { indexed: 0 };

  const operations = body.products.flatMap((p) => {
    const { _id, ...doc } = p;
    return [{ index: { _index: PRODUCT_INDEX, _id } }, doc];
  });
  const resp = await esClient.bulk({ operations, refresh: true });
  if (resp.errors) log.error("bulk reindex reported errors");
  return { indexed: body.products.length };
}
