import { meQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TNotification } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useMarkNotificationRead() {
  return useMutation<TNotification, AxiosError, number>({
    mutationFn: (id) => meQueries.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Ошибка при отметке уведомления", error);
    },
  });
}
