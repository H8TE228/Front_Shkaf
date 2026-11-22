import { conversationsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TConversation, TConversationCreateRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateConversation() {
  return useMutation<TConversation, AxiosError, TConversationCreateRequest>({
    mutationFn: conversationsQueries.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании диалога", error);
    },
  });
}
