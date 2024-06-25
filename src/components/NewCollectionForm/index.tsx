"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { createCollectionAndAddPictures } from "@/actions/collection";
import { useModal } from "@/providers/ModalProvider";
import { LightCollectionByUserId } from "@/types/collection";

import AddPicturesStep from "../AddPicturesDialog/AddPicturesStep";
import { CreateCollectionStep } from "../CreateCollectionStep";

const formSchema = z.object({
  collectionName: z.string().min(1, { message: "Collection name is required" }),
  selectedPictures: z.array(z.number()).default([]),
});

export type FormDataNewCollection = z.infer<typeof formSchema>;

export type NewCollectionFormProps = {
  defaultCollection: LightCollectionByUserId;
  profileUsername: string;
};

const NewCollectionForm = ({
  defaultCollection,
  profileUsername,
}: NewCollectionFormProps) => {
  const { closeModal } = useModal();
  const [selectedPictures, setSelectedPictures] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const queryClient = useQueryClient();

  const methods = useForm<FormDataNewCollection>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: createCollection, isPending } = useMutation({
    mutationFn: async (data: FormDataNewCollection) => {
      return await createCollectionAndAddPictures(
        data.collectionName,
        data.selectedPictures,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collections", profileUsername],
      });
    },
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

  const onSubmit = async (data: FormDataNewCollection) => {
    try {
      createCollection({
        collectionName: data.collectionName,
        selectedPictures: data.selectedPictures,
      });

      // await createCollectionAndAddPictures(
      //   data.collectionName,
      //   data.selectedPictures,
      // );
      // await handleRefetchCollection();

      closeModal();
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
            onClickNext={() => {
              return setCurrentStep(1);
            }}
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
            isLoading={isPending}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default NewCollectionForm;
