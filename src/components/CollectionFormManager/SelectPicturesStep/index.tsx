import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import ImageClient from "@/components/ImageClient";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LightCollectionByUserId } from "@/types/collection";

interface SelectPicturesStepProps {
  defaultCollection: LightCollectionByUserId;
  onPictureToggle: (picId: number) => void;
  isLoading: boolean;
  onBack?: () => void;
}

const SelectPicturesStep = ({
  defaultCollection,
  onPictureToggle,
  isLoading,
  onBack,
}: SelectPicturesStepProps) => {
  const { getValues } = useFormContext();
  const selectedPictures = getValues("selectedPictures");

  return (
    <div className="flex min-h-[691px] w-screen max-w-[400px] flex-col gap-0 overflow-hidden rounded-lg p-0">
      <Modal.Header>
        {onBack && <Modal.Header.ArrowBack onClick={onBack} />}
        <Modal.Header.Title>Add from saved</Modal.Header.Title>
      </Modal.Header>
      <div className="flex grow flex-col">
        <div className="grid grid-cols-3">
          {defaultCollection.pictures.map((picture) => (
            <button
              key={picture.picture.id}
              className="relative col-span-1 aspect-square transition hover:bg-white hover:opacity-70"
              type="button"
              onClick={() => onPictureToggle(picture.picture.id)}
            >
              <ImageClient
                alt="collection"
                className="object-cover"
                height={133}
                src={picture.picture.sizes.small}
                width={133}
              />
              {selectedPictures.includes(picture.picture.id) && (
                <div
                  className={cn(
                    "absolute inset-0 bg-white opacity-30 flex items-center justify-center",
                  )}
                >
                  <Check color="gray" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <Separator elevated />
      <div className="flex justify-center">
        <Button loading={isLoading} type="submit" variant="primary-ghost">
          Done
        </Button>
      </div>
    </div>
  );
};

export default SelectPicturesStep;
