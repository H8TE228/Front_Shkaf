import { InputSearch } from "./input-search";
import { Dialog, DialogContent } from "./ui/dialog";

type MobileSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
};

export function MobileSearchDialog({
  open,
  onOpenChange,
  onDismiss,
}: MobileSearchDialogProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="bg-popover/80 fixed inset-0 top-0 left-0 flex h-dvh min-h-dvh min-w-screen translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-3 pr-6"
        >
          <InputSearch
            variant="dialog"
            onCloseModal={onDismiss}
            focusOnOpen={open}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
