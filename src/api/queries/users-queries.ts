import type { TUser } from "@/types";
import { api } from "..";

export const usersQueries = {
  getUsers: async () => {
    const res = await api.get<TUser[]>("/users");
    return res.data;
  },

  updateUser: async (id: string, userData: unknown) => {
    const res = await api.put<TUser>(`/users/${id}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
