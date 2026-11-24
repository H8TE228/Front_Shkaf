import { meQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => meQueries.getSubscriptions(),
  });
}
