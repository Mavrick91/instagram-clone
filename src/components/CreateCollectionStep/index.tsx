import { useFormContext } from "react-hook-form";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Separator from "@/components/ui/separator";

import { FormDataNewCollection } from "../NewCollectionForm";

type Props = {
  onClickNext: () => void;
  labelSubmit: string;
};

export const CreateCollectionStep = ({ onClickNext, labelSubmit }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormDataNewCollection>();

  return (
    <div className="w-screen max-w-96 rounded-lg">
      <Modal.Header>
        <Modal.Header.Title>New collection</Modal.Header.Title>
      </Modal.Header>

      <div className="flex flex-col">
        <div className="mt-4 px-6">
          <Input
            {...register("collectionName")}
            placeholder="Collection name"
            autoComplete="off"
            autoFocus
            error={errors.collectionName?.message}
            className="border-separator bg-secondary-background placeholder:text-secondary"
          />
        </div>
        <Separator className="mt-4" />
        <div className="flex justify-center">
          <Button
            type="button"
            variant="blue-link"
            className="p-0"
            onClick={onClickNext}
          >
            {labelSubmit}
          </Button>
        </div>
      </div>
    </div>
  );
};
