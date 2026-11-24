import { meQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useDeleteSubscription() {
  return useMutation<void, AxiosError, number>({
    mutationFn: (id) => meQueries.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении подписки", error);
    },
  });
}
