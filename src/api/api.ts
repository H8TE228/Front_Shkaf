import axios from "axios";
// import { authQueries } from "./queries/admin-queries";
import { queryClient } from "@/main";
import { authQueries } from "./queries";

let isRefreshing = false;
type QueuedRequest = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let queue: QueuedRequest[] = [];

const processQueue = (error?: unknown) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve();
  });
  queue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (originalRequest.url === "/users/login/refresh") {
      forceLogout();
      return Promise.reject(error);
    }

    if (originalRequest.url === "/users/login") {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => {
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log("трай рефреша");
      await authQueries.refresh();

      processQueue();

      return api(originalRequest);
    } catch (err) {
      console.log("ошибка при рефреше", err);
      processQueue(err);

      forceLogout();

      return Promise.reject(err);
    } finally {
      console.log("рефреш завершен");
      isRefreshing = false;
    }
  },
);
