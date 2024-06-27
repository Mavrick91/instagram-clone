import { useFormContext } from "react-hook-form";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Separator from "@/components/ui/separator";

type CollectionNameStepProps = {
  isLoading: boolean;
};

const CollectionNameStep = ({ isLoading }: CollectionNameStepProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-screen max-w-96 rounded-lg">
      <Modal.Header>
        <Modal.Header.Title>New collection</Modal.Header.Title>
      </Modal.Header>
      <div className="flex flex-col">
        <div className="mt-4 px-6">
          <Input
            {...register("collectionName")}
            autoFocus
            autoComplete="off"
            className="border-ig-separator bg-ig-secondary-background placeholder:text-ig-secondary-text"
            error={errors.collectionName?.message as string}
            placeholder="Collection name"
          />
        </div>
        <Separator elevated className="mt-4" />
        <div className="flex justify-center py-2.5">
          <Button
            loading={isLoading}
            padding="none"
            type="submit"
            variant="primary-ghost"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionNameStep;
