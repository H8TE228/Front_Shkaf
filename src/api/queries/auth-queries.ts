import { api } from "@/api";
import type { TRegisterRequest, TUser } from "@/types";

export const authQueries = {
  register: async (data: TRegisterRequest) => {
    const res = await api.post<
      Pick<TUser, "id" | "email" | "username" | "created_at">
    >("/users/register", {
      ...data,
    });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post<TUser>("/users/login", {
      email,
      password,
    });
    return res.data;
  },

  logout: async () => {
    const res = await api.post<void>("/users/logout");
    return res.data;
  },

  refresh: async () => {
    const res = await api.post<void>("/users/login/refresh");
    return res.data;
  },
};
