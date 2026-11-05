import type { TItem, TItemPhoto } from "@/types";
import { api } from "../api";

export const itemsQueries = {
  getItems: async () => {
    const res = await api.get<TItem[]>("/items");
    return res.data;
  },

  getItemById: async (id: string) => {
    const res = await api.get<TItem>(`/items/${id}`);
    return res.data;
  },

  createItem: async (itemData: unknown) => {
    const res = await api.post<TItem>("/items", itemData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  updateItem: async (id: string, itemData: unknown) => {
    const res = await api.put<TItem>(`/items/${id}`, itemData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteItem: async (id: string) => {
    const res = await api.delete<void>(`/items/${id}`);
    return res.data;
  },

  createItemPhoto: async (id: string) => {
    const res = await api.post<TItemPhoto>(`/items/${id}/photo`, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteItemPhotoById: async (id: string, photoId: string) => {
    const res = await api.delete<void>(`/items/${id}/photo/${photoId}`);
    return res.data;
  },
};
