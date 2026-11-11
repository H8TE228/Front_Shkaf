import { createContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MobileSearchDialog } from "@/components/mobile-search-dialog";

type MobileSearchContextType = {
  openMobileSearchModal: () => void;
  closeMobileSearchModal: () => void;
  // dismissMobileSearchModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const MobileSearchContext =
  createContext<MobileSearchContextType | null>(null);

export function MobileSearchProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasHistoryEntry = useRef(false);

  function openMobileSearchModal() {
    if (!hasHistoryEntry.current) {
      navigate(`${location.pathname}${location.search}${location.hash}`, {
        state: location.state,
      });

      hasHistoryEntry.current = true;
    }

    setIsOpen(true);
  }

  // function closeMobileSearchModal() {
  //   if (hasHistoryEntry.current) {
  //     hasHistoryEntry.current = false;
  //     setIsOpen(false);
  //     navigate(-1);
  //     console.log(hasHistoryEntry.current, "2");
  //     return;
  //   }

  //   setIsOpen(false);
  // }

  function closeMobileSearchModal() {
    hasHistoryEntry.current = false;
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handlePopState() {
      hasHistoryEntry.current = false;
      setIsOpen(false);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen]);

  return (
    <MobileSearchContext
      value={{
        openMobileSearchModal,
        closeMobileSearchModal,
      }}
    >
      {children}

      <MobileSearchDialog
        open={isOpen}
        onOpenChange={(open) =>
          open ? openMobileSearchModal() : closeMobileSearchModal()
        }
      />
    </MobileSearchContext>
  );
}
