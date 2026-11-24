import { meQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useMarkAllNotificationsRead() {
  return useMutation<{ marked_read: number }, AxiosError, void>({
    mutationFn: () => meQueries.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Ошибка при отметке уведомлений", error);
    },
  });
}
