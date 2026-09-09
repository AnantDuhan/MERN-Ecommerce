import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  ApiReview,
  CreateReviewRequest,
  ReviewsResponse,
} from "../types/review";

export class ReviewsRepository {
  static async list(productId: string): Promise<ApiReview[]> {
    const { data } = await api.get<ReviewsResponse>(
      API_ENDPOINTS.REVIEWS.LIST,
      { params: { id: productId } }
    );
    return data.reviews ?? [];
  }

  static async create(payload: CreateReviewRequest) {
    const { data } = await api.post(API_ENDPOINTS.REVIEWS.CREATE, payload);
    return data;
  }

  static async remove(reviewId: string, productId: string) {
    const { data } = await api.delete(
      API_ENDPOINTS.REVIEWS.DELETE(reviewId),
      { params: { id: productId } }
    );
    return data;
  }
}
