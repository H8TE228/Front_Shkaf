import { meQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => meQueries.getMe(),
    retry: false, // чтобы убрать стандартные 3 попытки запроса при ошибке
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
