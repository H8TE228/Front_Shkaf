import type { TItemType } from "@/types";
import { api } from "../api";

export const itemTypesQueries = {
  getItemTypes: async () => {
    const res = await api.get<TItemType[]>("/itemTypes");
    return res.data;
  },

  getItemTypesById: async (id: string) => {
    const res = await api.get<TItemType>(`/itemTypes/${id}`);
    return res.data;
  },
};
