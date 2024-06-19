import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import ImageClient from "@/components/ImageClient";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UserDefaultCollectionPictures } from "@/types/collection";

import { FormData } from "../NewCollectionForm";

type Props = {
  defaultCollection: UserDefaultCollectionPictures;
  selectedPictures: number[];
  handlePictureClick: (pic: number) => void;
  setCurrentStep?: (step: number) => void;
  onSubmit: (data: FormData) => void;
};

export const AddPicturesStep = ({
  defaultCollection,
  selectedPictures,
  handlePictureClick,
  setCurrentStep,
  onSubmit,
}: Props) => {
  const { handleSubmit } = useFormContext<FormData>();

  return (
    <div className="flex min-h-[691px] w-screen max-w-[400px] flex-col gap-0 overflow-hidden rounded-lg p-0">
      <Modal.Header>
        {setCurrentStep && (
          <Modal.Header.ArrowBack onClick={() => setCurrentStep(0)} />
        )}
        <Modal.Header.Title>Add from saved</Modal.Header.Title>
      </Modal.Header>

      <div className="flex grow flex-col">
        <div className="grid grid-cols-3">
          {defaultCollection.pictures.map((picture) => {
            return (
              <button
                type="button"
                key={picture.picture.id}
                onClick={() => handlePictureClick(picture.picture.id)}
                className="relative col-span-1 aspect-square transition hover:bg-white hover:opacity-70"
              >
                <ImageClient
                  src={picture.picture.sizes.small}
                  alt="collection"
                  className="object-cover"
                  width={133}
                  height={133}
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
            );
          })}
        </div>
      </div>
      <Separator />
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit(onSubmit)}
          type="submit"
          variant="blue-link"
          className="p-0"
        >
          Done
        </Button>
      </div>
    </div>
  );
};
