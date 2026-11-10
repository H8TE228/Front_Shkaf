import { MobileSearchContext } from "@/components";
import { useContext } from "react";

export function useMobileSearch() {
  const context = useContext(MobileSearchContext);

  if (!context) {
    throw new Error(
      "useMobileSearch не может использоваться без MobileSearchProvider",
    );
  }

  return context;
}
