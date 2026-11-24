import { reviewsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TReview, TReviewCreateRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateReview() {
  return useMutation<TReview, AxiosError, TReviewCreateRequest>({
    mutationFn: (data) => reviewsQueries.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-rating"] });
    },
    onError: (error) => {
      console.error("Ошибка при отправке отзыва", error);
    },
  });
}
