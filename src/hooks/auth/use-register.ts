/* eslint-disable @typescript-eslint/no-explicit-any */
import { authQueries } from "@/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useRegister() {
  return useMutation<any, AxiosError<any>, { email: string; password: string }>(
    {
      mutationFn: (data: { email: string; password: string }) =>
        authQueries.register(data.email, data.password),
      onError: (error) => {
        console.error("Ошибка при регистрации", error);
      },
    },
  );
}
