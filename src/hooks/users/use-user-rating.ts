import { usersQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useUserRating(id: string) {
  return useQuery({
    queryKey: ["user-rating", id],
    queryFn: () => usersQueries.getUserRating(id),
    enabled: !!id,
  });
}
