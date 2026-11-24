import { exchangesQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useExchanges() {
  return useQuery({
    queryKey: ["exchanges"],
    queryFn: () => exchangesQueries.getExchanges(),
  });
}
