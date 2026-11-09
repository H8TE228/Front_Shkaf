import { exchangePointsQueries } from "@/api";
import type { TExchangePointsQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useExchangePoints(params?: TExchangePointsQueryParams) {
  return useQuery({
    queryKey: ["exchangePoints", params],
    queryFn: () => exchangePointsQueries.getExchangePoints(params),
    staleTime: Infinity,
  });
}
