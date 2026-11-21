import { bookmarksQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TBookmark } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateItemBookmark() {
  return useMutation<TBookmark, AxiosError, string>({
    mutationFn: bookmarksQueries.createItemBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) => {
      console.error("Ошибка при добавлении вещи в избранное", error);
    },
  });
}
