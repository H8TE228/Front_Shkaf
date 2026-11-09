import { itemsQueries } from "@/api";
import type { TItemsQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useItems(params?: TItemsQueryParams) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => itemsQueries.getItems(params),
    staleTime: Infinity,
  });
}
