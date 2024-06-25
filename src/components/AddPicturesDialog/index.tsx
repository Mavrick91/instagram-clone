import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import {
  addPictureToCollectionById,
  getDefaultCollectionByUsername,
} from "@/actions/collection";
import { useModal } from "@/providers/ModalProvider";
import { LightCollectionByUserId } from "@/types/collection";

import AddPicturesStep from "./AddPicturesStep";

const formSchema = z.object({
  selectedPictures: z.array(z.number()),
});

export type FormData = z.infer<typeof formSchema>;

export type AddPicturesDialogProps = {
  setCurrentStep?: (step: number) => void;
  collectionId: number;
  collectionNameId?: string;
};

const AddPicturesDialog = ({
  setCurrentStep,
  collectionId,
  collectionNameId,
}: AddPicturesDialogProps) => {
  const params = useParams();
  const username = params.username as string;
  const queryClient = useQueryClient();

  const { data: defaultCollection } = useQuery<LightCollectionByUserId>({
    queryKey: ["collection", username, "default"],
    queryFn: () => {
      return getDefaultCollectionByUsername(username);
    },
    initialData: () => {
      return queryClient.getQueryData(["collection", username, "default"])!;
    },
  });

  const { closeModal } = useModal();
  const [selectedPictures, setSelectedPictures] = useState<number[]>([]);
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    methods.register("selectedPictures");
  }, [methods]);

  const { mutate: updateCollectionPicture, isPending } = useMutation({
    mutationFn: async (selectedPictures: number[]) => {
      await addPictureToCollectionById(collectionId, selectedPictures);
    },
    onSuccess: async () => {
      if (collectionNameId) {
        await queryClient.invalidateQueries({
          queryKey: ["collection", username],
        });
        closeModal();
      }
    },
  });

  const onSubmitAddPicture = async (data: FormData) => {
    try {
      updateCollectionPicture(data.selectedPictures);
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
        <AddPicturesStep
          isLoading={isPending}
          defaultCollection={defaultCollection}
          selectedPictures={selectedPictures}
          handlePictureClick={handlePictureClick}
          setCurrentStep={setCurrentStep}
          onSubmit={onSubmitAddPicture}
        />
      </form>
    </FormProvider>
  );
};

export default AddPicturesDialog;
