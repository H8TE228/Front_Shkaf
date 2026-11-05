import { itemsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: itemsQueries.getItems,
  });
}
