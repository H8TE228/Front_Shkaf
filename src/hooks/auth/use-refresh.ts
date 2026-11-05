import { authQueries } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useRefresh() {
  return useMutation({
    mutationFn: () => authQueries.refresh(),
  });
}
