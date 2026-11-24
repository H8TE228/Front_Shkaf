import { meQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TSubscription, TSubscriptionCreateRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateSubscription() {
  return useMutation<TSubscription, AxiosError, TSubscriptionCreateRequest>({
    mutationFn: (data) => meQueries.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании подписки", error);
    },
  });
}
