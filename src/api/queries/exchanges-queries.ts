import type {
  TExchange,
  TExchangesQueryParams,
  TPaginatedExchangeList,
} from "@/types";
import { api } from "../api";

export const exchangesQueries = {
  getExchanges: async (params?: TExchangesQueryParams) => {
    const res = await api.get<TPaginatedExchangeList>("/exchanges", {
      params,
    });
    return res.data;
  },

  getExchange: async (id: string) => {
    const res = await api.get<TExchange>(`/exchanges/${id}`);
    return res.data;
  },

  getItemExchanges: async (itemId: string) => {
    const res = await api.get<TPaginatedExchangeList>(
      `/items/${itemId}/exchanges`,
      { params: { page_size: 100 } },
    );
    return res.data;
  },

  createItemExchange: async (itemId: string) => {
    const res = await api.post<TExchange>(`/items/${itemId}/exchanges`);
    return res.data;
  },

  agreeExchange: async (id: string) => {
    const res = await api.post<TExchange>(`/exchanges/${id}/agree`);
    return res.data;
  },

  declineExchange: async (id: string) => {
    const res = await api.post<TExchange>(`/exchanges/${id}/decline`);
    return res.data;
  },

  cancelExchange: async (id: string) => {
    const res = await api.post<TExchange>(`/exchanges/${id}/cancel`);
    return res.data;
  },

  confirmExchange: async (id: string) => {
    const res = await api.post<TExchange>(`/exchanges/${id}/confirm`);
    return res.data;
  },
};
