/* eslint-disable @typescript-eslint/no-explicit-any */
import { authQueries } from "@/api";
import { queryClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  return useMutation<void, AxiosError<any>, void>({
    mutationFn: () => authQueries.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/login");
    },
    onError: () => {},
  });
}
