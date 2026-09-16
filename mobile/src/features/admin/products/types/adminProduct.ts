export interface AdminProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  Stock: number;
  ratings: number;
  numOfReviews: number;
  images: { _id?: string; url: string }[];
  createdAt: string;
}

export interface AdminProductsResponse {
  success: boolean;
  products: AdminProduct[];
}

export interface AdminProductResponse {
  success: boolean;
  product: AdminProduct;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  Stock: string;
}
