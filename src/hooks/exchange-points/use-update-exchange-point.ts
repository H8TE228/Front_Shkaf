import { exchangePointsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TExchangePoint, TExchangePointUpdateRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useUpdateExchangePoint() {
  return useMutation<
    TExchangePoint,
    AxiosError,
    { id: string; exchangePointData: TExchangePointUpdateRequest }
  >({
    mutationFn: ({ id, exchangePointData }) =>
      exchangePointsQueries.updateExchangePoint(id, exchangePointData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exchangePoints"] });
      queryClient.invalidateQueries({
        queryKey: ["exchangePoints", variables.id],
      });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении пункта обмена", error);
    },
  });
}
