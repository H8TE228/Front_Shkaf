import type { TBookmark, TBookmarkItem, TBookmarksQueryParams } from "@/types";
import { api } from "../api";

export const bookmarksQueries = {
  getBookmarks: async (params?: TBookmarksQueryParams) => {
    const res = await api.get<TBookmarkItem>("/me/bookmarks", { params });
    return res.data;
  },

  createItemBookmark: async (id: string) => {
    const res = await api.post<TBookmark>(`/items/${id}/bookmark`);
    return res.data;
  },

  deleteItemBookmark: async (id: string) => {
    const res = await api.delete<void>(`/items/${id}/bookmark`);
    return res.data;
  },

  createExchangePointBookmark: async (id: string) => {
    const res = await api.post<TBookmark>(`/exchangePoints/${id}/bookmark`);
    return res.data;
  },

  deleteExchangePointBookmark: async (id: string) => {
    const res = await api.delete<void>(`/exchangePoints/${id}/bookmark`);
    return res.data;
  },
};
