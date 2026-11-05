import { authQueries } from "@/api";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authQueries.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/login");
    },
    onError: () => {},
  });
}
