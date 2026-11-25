import { exchangesQueries } from "@/api";
import type { TExchangesQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useExchanges(params?: TExchangesQueryParams) {
  return useQuery({
    queryKey: params ? ["exchanges", params] : ["exchanges"],
    queryFn: () => exchangesQueries.getExchanges(params),
  });
}
