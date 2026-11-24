import type { TExchange, TPaginatedExchangeList } from "@/types";
import { api } from "../api";

export const exchangesQueries = {
  getExchanges: async () => {
    const res = await api.get<TPaginatedExchangeList>("/exchanges");
    return res.data;
  },

  getExchange: async (id: string) => {
    const res = await api.get<TExchange>(`/exchanges/${id}`);
    return res.data;
  },
};
