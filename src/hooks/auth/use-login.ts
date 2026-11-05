/* eslint-disable @typescript-eslint/no-explicit-any */
import { authQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useLogin() {
  return useMutation<any, AxiosError<any>, { email: string; password: string }>(
    {
      mutationFn: (data: { email: string; password: string }) =>
        authQueries.login(data.email, data.password),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
      onError: (error) => {
        console.error("Ошибка при входе", error);
      },
    },
  );
}
