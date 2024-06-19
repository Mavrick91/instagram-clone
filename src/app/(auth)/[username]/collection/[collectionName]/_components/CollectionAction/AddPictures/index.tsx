import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { addPictureToCollectionById } from "@/actions/collection";
import { AddPicturesStep } from "@/app/(auth)/[username]/(profile)/saved/_components/NewCollection/AddPicturesStep";
import { Dialog } from "@/components/ui/dialog";
import { revalidateCollectionPage } from "@/constants/revalidate";
import { UserDefaultCollectionPictures } from "@/types/collection";

const formSchema = z.object({
  selectedPictures: z.array(z.number()),
});

export type FormData = z.infer<typeof formSchema>;

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setCurrentStep?: (step: number) => void;
  collectionId: number;
  defaultCollection: UserDefaultCollectionPictures;
};

export const AddPictures: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  setCurrentStep,
  collectionId,
  defaultCollection,
}) => {
  const [selectedPictures, setSelectedPictures] = useState<number[]>([]);
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    methods.register("selectedPictures");
  }, [methods]);

  const onSubmitAddPicture = async (data: FormData) => {
    try {
      await addPictureToCollectionById(
        collectionId,
        data.selectedPictures,
        revalidateCollectionPage,
      );

      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error)
        toast.error("Failed to update collection's pictures");
    }
  };

  const handlePictureClick = (picId: number) => {
    const newSelectedPictures = [...selectedPictures];
    const index = newSelectedPictures.indexOf(picId);

    if (index > -1) {
      newSelectedPictures.splice(index, 1);
    } else {
      newSelectedPictures.push(picId);
    }

    setSelectedPictures(newSelectedPictures);
    methods.setValue("selectedPictures", newSelectedPictures);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitAddPicture)}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <AddPicturesStep
            defaultCollection={defaultCollection}
            selectedPictures={selectedPictures}
            handlePictureClick={handlePictureClick}
            setCurrentStep={setCurrentStep}
            onSubmit={onSubmitAddPicture}
          />
        </Dialog>
      </form>
    </FormProvider>
  );
};
