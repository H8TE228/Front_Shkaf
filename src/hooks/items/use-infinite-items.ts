import { itemsQueries } from "@/api";
import type { TItemsQueryParams } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const ITEMS_PAGE_SIZE = 10;

export function useInfiniteItems(params?: TItemsQueryParams) {
  return useInfiniteQuery({
    queryKey: ["items", "infinite", params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      itemsQueries.getItems({
        ...params,
        page: pageParam,
        page_size: ITEMS_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.next ? lastPageParam + 1 : undefined,
    staleTime: Infinity,
  });
}
