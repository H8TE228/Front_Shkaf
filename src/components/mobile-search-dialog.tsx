import { Search } from "lucide-react";
import { useState } from "react";
import { InputSearch } from "./input-search";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function MobileSearchDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-primary hover:bg-muted flex size-23 cursor-pointer items-center justify-center rounded-2xl transition-colors"
      >
        <Search className="size-9" />
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="top-2/5">
          <DialogHeader>
            <DialogTitle>Поиск по каталогу</DialogTitle>
          </DialogHeader>
          <InputSearch variant="dialog" onNavigate={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
