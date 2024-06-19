import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { createCollectionAndAddPictures } from "@/actions/collection";
import { UserDefaultCollectionPictures } from "@/types/collection";
import { RevalidatePath } from "@/types/global";

import { AddPicturesStep } from "../AddPicturesStep";
import { CreateCollectionStep } from "../CreateCollectionStep";

const formSchema = z.object({
  collectionName: z.string().min(1, { message: "Collection name is required" }),
  selectedPictures: z.array(z.number()).default([]),
});

export type FormData = z.infer<typeof formSchema>;

const revalidatePath: RevalidatePath = {
  originalPath: "/(auth)/[username]/(profile)/saved",
  type: "page",
};

type NewCollectionFormProps = {
  onClose: () => void;
  defaultCollection: UserDefaultCollectionPictures;
};

const NewCollectionForm = ({
  onClose,
  defaultCollection,
}: NewCollectionFormProps) => {
  const [selectedPictures, setSelectedPictures] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    methods.register("selectedPictures");
  }, [methods]);

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

  const onSubmit = async (data: FormData) => {
    try {
      await createCollectionAndAddPictures(
        data.collectionName,
        data.selectedPictures,
        revalidatePath,
      );

      onClose();
    } catch (error) {
      if (error instanceof Error)
        toast.error("Failed to create saved " + error.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {currentStep === 0 && (
          <CreateCollectionStep
            onClickNext={() => setCurrentStep(1)}
            labelSubmit="Next"
          />
        )}

        {currentStep === 1 && (
          <AddPicturesStep
            defaultCollection={defaultCollection}
            selectedPictures={selectedPictures}
            handlePictureClick={handlePictureClick}
            setCurrentStep={setCurrentStep}
            onSubmit={onSubmit}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default NewCollectionForm;
