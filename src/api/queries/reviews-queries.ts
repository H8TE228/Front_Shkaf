import type {
  TPaginatedReviewList,
  TReview,
  TReviewCreateRequest,
  TReviewsQueryParams,
} from "@/types";
import { api } from "../api";

export const reviewsQueries = {
  getReviews: async (params?: TReviewsQueryParams) => {
    const res = await api.get<TPaginatedReviewList>("/reviews", { params });
    return res.data.results;
  },

  createReview: async (data: TReviewCreateRequest) => {
    const res = await api.post<TReview>("/reviews", data);
    return res.data;
  },
};
