import { exchangesQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TExchange } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useAgreeExchange() {
  return useMutation<TExchange, AxiosError, string>({
    mutationFn: exchangesQueries.agreeExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.error("Ошибка при принятии заявки", error);
    },
  });
}
