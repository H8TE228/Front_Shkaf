import { meQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TPatchedUser, TUser } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useUpdateMe() {
  return useMutation<TUser, AxiosError, TPatchedUser>({
    mutationFn: (data) => meQueries.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении профиля", error);
    },
  });
}
