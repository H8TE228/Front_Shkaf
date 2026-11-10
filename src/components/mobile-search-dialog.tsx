import { InputSearch } from "./input-search";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type MobileSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileSearchDialog({
  open,
  onOpenChange,
}: MobileSearchDialogProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="top-2/5">
          <DialogHeader>
            <DialogTitle>Поиск по каталогу</DialogTitle>
          </DialogHeader>
          <InputSearch
            variant="dialog"
            onNavigate={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
