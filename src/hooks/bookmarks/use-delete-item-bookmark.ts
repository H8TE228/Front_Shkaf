import { bookmarksQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useDeleteItemBookmark() {
  return useMutation<void, AxiosError, string>({
    mutationFn: bookmarksQueries.deleteItemBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении вещи из избранного", error);
    },
  });
}
