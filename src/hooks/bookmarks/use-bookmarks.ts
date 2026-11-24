import { bookmarksQueries } from "@/api";
import type { TBookmarksQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBookmarks(params?: TBookmarksQueryParams, enabled = true) {
  return useQuery({
    queryKey: ["bookmarks", params],
    queryFn: () => bookmarksQueries.getBookmarks(params),
    staleTime: Infinity,
    enabled,
  });
}
