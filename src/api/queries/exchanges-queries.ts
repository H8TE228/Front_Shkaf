import type { TExchange } from "@/types";
import { api } from "../api";

export const exchangesQueries = {
  getExchanges: async () => {
    const res = await api.get<TExchange[]>("/exchanges");
    return res.data;
  },

  getExchange: async (id: string) => {
    const res = await api.get<TExchange>(`/exchanges/${id}`);
    return res.data;
  },
};
