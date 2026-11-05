/* eslint-disable @typescript-eslint/no-explicit-any */
import { itemsQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useDeleteItem() {
  return useMutation<void, AxiosError<any>, string>({
    mutationFn: itemsQueries.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении объявления", error);
    },
  });
}
