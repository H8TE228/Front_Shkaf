import { exchangePointsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TExchangePoint, TExchangePointCreateRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateExchangePoint() {
  return useMutation<TExchangePoint, AxiosError, TExchangePointCreateRequest>({
    mutationFn: exchangePointsQueries.createExchangePoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchangePoints"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании пункта обмена", error);
    },
  });
}
