/* eslint-disable @typescript-eslint/no-explicit-any */
import { itemsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TItem, TItemCreateRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateItem() {
  return useMutation<TItem, AxiosError<any>, TItemCreateRequest>({
    mutationFn: itemsQueries.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании объявления", error);
    },
  });
}
