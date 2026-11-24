import { meQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useMyItems() {
  return useQuery({
    queryKey: ["my-items"],
    queryFn: () => meQueries.getMyItems(),
  });
}
