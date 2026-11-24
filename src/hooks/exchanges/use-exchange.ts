import { exchangesQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useExchange(id: string) {
  return useQuery({
    queryKey: ["exchanges", id],
    queryFn: () => exchangesQueries.getExchange(id),
    enabled: !!id,
  });
}
