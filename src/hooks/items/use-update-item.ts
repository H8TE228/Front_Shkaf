import { itemsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TItem } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useUpdateItem() {
  return useMutation<TItem, AxiosError, { id: string; itemData: unknown }>({
    mutationFn: ({ id, itemData }) => itemsQueries.updateItem(id, itemData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({
        queryKey: ["items", variables.id],
      });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении объявления", error);
    },
  });
}
