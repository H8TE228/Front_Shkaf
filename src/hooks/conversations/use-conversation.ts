import { conversationsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => conversationsQueries.getConversationById(id),
    enabled: !!id,
  });
}
