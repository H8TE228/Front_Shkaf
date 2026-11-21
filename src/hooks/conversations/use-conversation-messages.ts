import { conversationsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useConversationMessages(id: string) {
  return useQuery({
    queryKey: ["conversations", id, "messages"],
    queryFn: () => conversationsQueries.getMessages(id),
    enabled: !!id,
  });
}
