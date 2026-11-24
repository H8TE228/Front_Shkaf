import { reviewsQueries } from "@/api";
import type { TReviewsQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useReviews(params?: TReviewsQueryParams) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => reviewsQueries.getReviews(params),
  });
}
