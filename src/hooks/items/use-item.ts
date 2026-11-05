import { itemsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useItemById(id: string) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => itemsQueries.getItemById(id),
    enabled: !!id,
  });
}
