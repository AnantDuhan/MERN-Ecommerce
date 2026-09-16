import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toProduct, toProductList } from "../mappers/product.mapper";
import {
  ProductDetailResponse,
  ProductListResult,
  ProductsQuery,
  ProductsResponse,
} from "../types/product";

export class ProductsRepository {
  static async list(query: ProductsQuery = {}): Promise<ProductListResult> {
    const { data } = await api.get<ProductsResponse>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: query }
    );

    return {
      products: toProductList(data.products),
      productsCount: Number(data.productsCount) || 0,
      resultPerPage: Number(data.resultPerPage) || 0,
      filteredProductsCount: Number(data.filteredProductsCount) || 0,
    };
  }

  static async detail(id: string) {
    const { data } = await api.get<ProductDetailResponse>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return toProduct(data.product);
  }
}
