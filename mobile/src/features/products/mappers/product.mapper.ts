import { Product } from "@/types/product";
import { ApiProduct } from "../types/product";

/** Map a backend product doc to the UI product view-model. */
export function toProduct(api: ApiProduct): Product {
  const images = (api.images ?? [])
    .filter((i) => !!i?.url)
    .map((i) => ({ uri: i.url }));

  return {
    id: api._id,
    // backend has no brand field — surface the category as the eyebrow
    brand: api.category ?? "",
    name: api.name,
    category: api.category ?? "",
    description: api.description ?? "",
    images,
    price: api.price ?? 0,
    rating: api.ratings ?? 0,
    reviews: api.numOfReviews ?? 0,
    favourite: false,
  };
}

export function toProductList(list: ApiProduct[]): Product[] {
  return (list ?? []).map(toProduct);
}
