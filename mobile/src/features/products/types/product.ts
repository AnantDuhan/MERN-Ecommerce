import { Product } from "@/types/product";

/** Raw product as returned by the Node backend. */
export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  ratings?: number;
  numOfReviews?: number;
  category?: string;
  Stock?: number;
  images?: { url: string }[];
}

export interface ProductsResponse {
  success: boolean;
  products: ApiProduct[];
  productsCount: number;
  resultPerPage: number | string;
  filteredProductsCount: number;
}

export interface ProductDetailResponse {
  success: boolean;
  product: ApiProduct;
}

export interface ProductsQuery {
  keyword?: string;
  category?: string;
  page?: number;
  "price[gte]"?: number;
  "price[lte]"?: number;
  "ratings[gte]"?: number;
}

/** Normalised list result the UI consumes. */
export interface ProductListResult {
  products: Product[];
  productsCount: number;
  resultPerPage: number;
  filteredProductsCount: number;
}
