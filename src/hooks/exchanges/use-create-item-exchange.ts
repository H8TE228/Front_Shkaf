import { exchangesQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TExchange } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateItemExchange() {
  return useMutation<TExchange, AxiosError, string>({
    mutationFn: exchangesQueries.createItemExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании заявки", error);
    },
  });
}
