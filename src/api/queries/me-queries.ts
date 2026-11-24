import type {
  TItem,
  TNotification,
  TPatchPassword,
  TSubscription,
  TSubscriptionCreateRequest,
  TUser,
} from "@/types";
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

  getNotifications: async () => {
    const res = await api.get<TNotification[]>("/me/notifications");
    return res.data;
  },

  markNotificationRead: async (id: number) => {
    const res = await api.post<TNotification>(`/me/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await api.post<{ marked_read: number }>(
      "/me/notifications/read-all",
    );
    return res.data;
  },

  getSubscriptions: async () => {
    const res = await api.get<TSubscription[]>("/me/subscriptions");
    return res.data;
  },

  createSubscription: async (data: TSubscriptionCreateRequest) => {
    const res = await api.post<TSubscription>("/me/subscriptions", data);
    return res.data;
  },

  deleteSubscription: async (id: number) => {
    const res = await api.delete<void>(`/me/subscriptions/${id}`);
    return res.data;
  },
};
