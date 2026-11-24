import { usersQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersQueries.getUsers(),
  });
}
