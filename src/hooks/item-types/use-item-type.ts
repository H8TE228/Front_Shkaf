import { itemTypesQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useItemTypeById(id: string) {
  return useQuery({
    queryKey: ["itemTypes", id],
    queryFn: () => itemTypesQueries.getItemTypesById(id),
    enabled: !!id,
  });
}
