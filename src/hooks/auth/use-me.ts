import { authQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authQueries.me(),
    retry: false, // чтобы убрать стандартные 3 попытки запроса при ошибке
    staleTime: 5 * 60 * 1000,
  });
}
