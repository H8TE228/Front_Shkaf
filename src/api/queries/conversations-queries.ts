import type {
  TConversation,
  TConversationCreateRequest,
  TConversationMessage,
  TConversationReadResponse,
} from "@/types";
import { api } from "../api";

export const conversationsQueries = {
  getConversations: async () => {
    const res = await api.get<TConversation[]>("/conversations");
    return res.data;
  },

  getConversationById: async (id: string) => {
    const res = await api.get<TConversation>(`/conversations/${id}`);
    return res.data;
  },

  createConversation: async (data: TConversationCreateRequest) => {
    const res = await api.post<TConversation>("/conversations", data);
    return res.data;
  },

  getMessages: async (id: string) => {
    const res = await api.get<TConversationMessage[]>(
      `/conversations/${id}/messages`,
    );
    return res.data;
  },

  sendMessage: async (id: string, body: string) => {
    const res = await api.post<TConversationMessage>(
      `/conversations/${id}/messages`,
      { body },
    );
    return res.data;
  },

  markRead: async (id: string) => {
    const res = await api.post<TConversationReadResponse>(
      `/conversations/${id}/read`,
    );
    return res.data;
  },
};
