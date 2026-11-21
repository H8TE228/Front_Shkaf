import { conversationsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TConversationReadResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useMarkConversationRead() {
  return useMutation<TConversationReadResponse, AxiosError, string>({
    mutationFn: conversationsQueries.markRead,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversations", id] });
      queryClient.invalidateQueries({
        queryKey: ["conversations", id, "messages"],
      });
    },
    onError: (error) => {
      console.error("Ошибка при отметке диалога прочитанным", error);
    },
  });
}
