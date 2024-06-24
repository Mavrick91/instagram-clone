import { useModal } from "@/providers/ModalProvider";

import Separator from "../ui/separator";

export type ExitDialogProps = {
  handleDiscard: () => void;
};

const ExitDialog = ({ handleDiscard }: ExitDialogProps) => {
  const { closeModal } = useModal();

  const handleClickDiscard = () => {
    handleDiscard();
    closeModal();
  };

  return (
    <div className="max-w-96">
      <div className="flex flex-col items-center p-8">
        <span className="text-xl">Discard post?</span>
        <span className="mt-1 text-sm text-secondary">
          {`If you leave, your edits won't be saved.`}
        </span>
      </div>
      <Separator />
      <button
        type="button"
        className="w-full py-3 text-sm font-bold text-destructive"
        onClick={handleClickDiscard}
      >
        Discard
      </button>
      <Separator />
      <button
        type="button"
        className="w-full py-3 text-sm"
        onClick={closeModal}
      >
        Cancel
      </button>
    </div>
  );
};

export default ExitDialog;
