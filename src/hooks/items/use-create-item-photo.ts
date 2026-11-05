/* eslint-disable @typescript-eslint/no-explicit-any */
import { itemsQueries } from "@/api";
import { queryClient } from "@/lib";
import type { TItemPhoto } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useCreateItemPhoto() {
  return useMutation<
    TItemPhoto,
    AxiosError<any>,
    { id: string; photoData: FormData }
  >({
    mutationFn: ({ id, photoData }) =>
      itemsQueries.createItemPhoto(id, photoData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["items", variables.id],
      });
    },
    onError: (error) => {
      console.error("Ошибка при добавлении фотографии", error);
    },
  });
}
