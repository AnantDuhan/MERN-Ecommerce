export interface ApiReview {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: ApiReview[];
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
  productId: string;
}
