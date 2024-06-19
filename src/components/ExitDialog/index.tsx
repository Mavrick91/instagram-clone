import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import Separator from "../ui/separator";

type Props = {
  onClose: () => void;
  handleDiscardChanges: () => void;
};

export default function ExitDialog({ onClose, handleDiscardChanges }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCloseModal = () => {
    onClose();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-96">
        <div className="flex flex-col items-center p-8">
          <span className="text-xl">Discard post?</span>
          <span className="mt-1 text-sm text-secondary">
            {`If you leave, your edits won't be saved.`}
          </span>
        </div>
        <Separator />
        <button
          type="button"
          className="py-3 text-sm font-bold text-destructive"
          onClick={() => {
            handleDiscardChanges();
            handleCloseModal();
          }}
        >
          Discard
        </button>
        <Separator />
        <button
          type="button"
          className="py-3 text-sm"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  );
}
