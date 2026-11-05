/* eslint-disable @typescript-eslint/no-explicit-any */
import { authQueries } from "@/api";
import type { TRegisterRequest, TRegisterResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useRegister() {
  return useMutation<TRegisterResponse, AxiosError<any>, TRegisterRequest>({
    mutationFn: (data) => authQueries.register(data),
    onError: (error) => {
      console.error("Ошибка при регистрации", error);
    },
  });
}
