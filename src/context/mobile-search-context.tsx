import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { MobileSearchDialog } from "@/components/mobile-search-dialog";

type MobileSearchContextType = {
  openMobileSearch: () => void;
  closeMobileSearch: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const MobileSearchContext =
  createContext<MobileSearchContextType | null>(null);

export function MobileSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  function openMobileSearch() {
    setIsOpen(true);
  }

  function closeMobileSearch() {
    setIsOpen(false);
  }

  return (
    <MobileSearchContext value={{ openMobileSearch, closeMobileSearch }}>
      {children}

      <MobileSearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </MobileSearchContext>
  );
}
