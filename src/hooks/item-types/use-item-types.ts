import { itemTypesQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useItemTypes() {
  return useQuery({
    queryKey: ["itemTypes"],
    queryFn: () => itemTypesQueries.getItemTypes(),
    staleTime: Infinity,
  });
}
