import { itemsQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useDeleteItemPhoto() {
  return useMutation<void, AxiosError, { id: string; photoId: string }>({
    mutationFn: ({ id, photoId }) =>
      itemsQueries.deleteItemPhotoById(id, photoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["items", variables.id],
      });
    },
    onError: (error) => {
      console.error("Ошибка при удалении фотографии", error);
    },
  });
}
