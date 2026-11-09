import type {
  TExchangePoint,
  TExchangePointCreateRequest,
  TExchangePointUpdateRequest,
  TExchangePointsQueryParams,
} from "@/types";
import { api } from "../api";

export const exchangePointsQueries = {
  getExchangePoints: async (params?: TExchangePointsQueryParams) => {
    const res = await api.get<TExchangePoint[]>("/exchangePoints", {
      params,
    });
    return res.data;
  },

  createExchangePoint: async (
    exchangePointData: TExchangePointCreateRequest,
  ) => {
    const res = await api.post<TExchangePoint>(
      "/exchangePoints",
      exchangePointData,
    );
    return res.data;
  },

  getExchangePointById: async (id: string) => {
    const res = await api.get<TExchangePoint>(`/exchangePoints/${id}`);
    return res.data;
  },

  updateExchangePoint: async (
    id: string,
    exchangePointData: TExchangePointUpdateRequest,
  ) => {
    const res = await api.patch<TExchangePoint>(
      `/exchangePoints/${id}`,
      exchangePointData,
    );
    return res.data;
  },
};
