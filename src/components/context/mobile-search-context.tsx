import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { MobileSearchDialog } from "@/components/mobile-search-dialog";

type MobileSearchContextType = {
  openSearch: () => void;
  closeSearch: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const MobileSearchContext =
  createContext<MobileSearchContextType | null>(null);

export function MobileSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  function openSearch() {
    setIsOpen(true);
  }

  function closeSearch() {
    setIsOpen(false);
  }

  return (
    <MobileSearchContext value={{ openSearch, closeSearch }}>
      {children}

      <MobileSearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </MobileSearchContext>
  );
}
