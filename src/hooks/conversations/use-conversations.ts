import { conversationsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => conversationsQueries.getConversations(),
    staleTime: Infinity,
  });
}
