import type { TRating, TPaginatedUserList, TUser } from "@/types";
import { api } from "..";

export const usersQueries = {
  getUsers: async () => {
    const res = await api.get<TPaginatedUserList>("/users");
    return res.data;
  },

  getUserRating: async (id: string) => {
    const res = await api.get<TRating>(`/users/${id}/rating`);
    return res.data;
  },

  updateUser: async (id: string, userData: unknown) => {
    const res = await api.put<TUser>(`/users/${id}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
