import { conversationsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useConversations(options?: {
  refetchInterval?: number | false;
}) {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => conversationsQueries.getConversations(),
    refetchInterval: options?.refetchInterval,
    refetchIntervalInBackground: false,
  });
}
