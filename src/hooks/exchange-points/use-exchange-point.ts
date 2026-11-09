import { exchangePointsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useExchangePointById(id: string) {
  return useQuery({
    queryKey: ["exchangePoints", id],
    queryFn: () => exchangePointsQueries.getExchangePointById(id),
    enabled: !!id,
  });
}
