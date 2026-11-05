/* eslint-disable @typescript-eslint/no-explicit-any */
import { authQueries } from "@/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useRefresh() {
  return useMutation<void, AxiosError<any>, void>({
    mutationFn: () => authQueries.refresh(),
  });
}
