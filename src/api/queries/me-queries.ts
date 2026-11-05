import type { TItem, TPatchPassword, TUser } from "@/types";
import { api } from "../api";

export const meQueries = {
  getMe: async () => {
    const res = await api.get<TUser>("/me");
    return res.data;
  },

  updateMe: async (data: unknown) => {
    const res = await api.patch<TUser>("/me", data);
    return res.data;
  },

  deleteMe: async () => {
    const res = await api.delete<void>("/me");
    return res.data;
  },

  getMyItems: async () => {
    const res = await api.get<TItem[]>(`/me/items`);
    return res.data;
  },

  changeMyPassword: async (oldPassword: string, newPassword: string) => {
    const res = await api.put<TPatchPassword>(`/me/change-password`, {
      oldPassword,
      newPassword,
    });
    return res.data;
  },
};
