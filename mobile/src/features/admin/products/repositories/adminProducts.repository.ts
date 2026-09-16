import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  AdminProduct,
  AdminProductResponse,
  AdminProductsResponse,
  ProductFormData,
} from "../types/adminProduct";

interface ImageAsset {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}

function buildFormData(data: ProductFormData, images?: ImageAsset[]) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("category", data.category);
  formData.append("Stock", data.Stock);

  images?.forEach((image, index) => {
    formData.append("images", {
      uri: image.uri,
      name: image.fileName ?? `product-${index}.jpg`,
      type: image.mimeType ?? "image/jpeg",
    } as any);
  });

  return formData;
}

export class AdminProductsRepository {
  static async list(): Promise<AdminProduct[]> {
    const { data } = await api.get<AdminProductsResponse>(
      API_ENDPOINTS.ADMIN.PRODUCTS
    );
    return data.products;
  }

  static async create(
    formValues: ProductFormData,
    images: ImageAsset[]
  ): Promise<AdminProduct> {
    const { data } = await api.post<AdminProductResponse>(
      API_ENDPOINTS.ADMIN.PRODUCT_CREATE,
      buildFormData(formValues, images),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.product;
  }

  static async update(
    id: string,
    formValues: ProductFormData,
    images?: ImageAsset[]
  ): Promise<AdminProduct> {
    const { data } = await api.put<AdminProductResponse>(
      API_ENDPOINTS.ADMIN.PRODUCT_UPDATE(id),
      buildFormData(formValues, images),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.product;
  }

  static async remove(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.ADMIN.PRODUCT_DELETE(id));
  }
}
