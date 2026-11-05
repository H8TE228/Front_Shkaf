import axios, { type InternalAxiosRequestConfig } from "axios";
import { authQueries } from "./queries";
import { queryClient } from "@/lib";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<void> | null = null;

function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = authQueries
      .refresh()
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function forceLogout() {
  queryClient.setQueryData(["me"], null);
}

export const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const originalRequest = error.config as RetryableRequest | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      throw error;
    }

    const url = originalRequest.url;

    if (
      url === "/users/login" ||
      url === "/users/register" ||
      url === "/users/login/refresh"
    ) {
      throw error;
    }

    if (originalRequest._retry) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();

      return api(originalRequest);
    } catch (refreshError) {
      forceLogout();
      throw refreshError;
    }
  },
);
