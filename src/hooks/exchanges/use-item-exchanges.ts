import { exchangesQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useItemExchanges(itemId: string) {
  return useQuery({
    queryKey: ["exchanges", "item", itemId],
    queryFn: () => exchangesQueries.getItemExchanges(itemId),
    enabled: !!itemId,
  });
}
