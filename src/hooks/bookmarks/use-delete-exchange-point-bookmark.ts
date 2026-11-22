import { bookmarksQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useDeleteExchangePointBookmark() {
  return useMutation<void, AxiosError, string>({
    mutationFn: bookmarksQueries.deleteExchangePointBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении пункта из избранного", error);
    },
  });
}
