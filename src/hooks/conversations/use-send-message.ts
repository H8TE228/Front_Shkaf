import { conversationsQueries } from "@/api";
import { queryClient } from "@/lib";
import type {
  TConversationMessage,
  TConversationMessageCreateRequest,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useSendMessage() {
  return useMutation<
    TConversationMessage,
    AxiosError,
    TConversationMessageCreateRequest
  >({
    mutationFn: ({ id, body }) => conversationsQueries.sendMessage(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.id, "messages"],
      });
    },
    onError: (error) => {
      console.error("Ошибка при отправке сообщения", error);
    },
  });
}
