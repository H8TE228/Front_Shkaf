import { usersQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersQueries.getUser(id),
    enabled: !!id,
  });
}
