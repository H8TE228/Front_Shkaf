import { meQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => meQueries.getNotifications(),
  });
}
