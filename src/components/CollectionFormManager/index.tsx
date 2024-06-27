import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  addPictureToCollectionById,
  createCollectionAndAddPictures,
  getDefaultCollectionByUsername,
  updateCollectionName,
} from "@/actions/collection";
import { LightCollectionByUserId } from "@/types/collection";

import CollectionNameStep from "./CollectionNameStep";
import SelectPicturesStep from "./SelectPicturesStep";

const formSchema = z.object({
  collectionName: z.string().min(1, { message: "Collection name is required" }),
  selectedPictures: z.array(z.number()).default([]),
});

type FormData = z.infer<typeof formSchema>;

type StepState = "name" | "pictures";

interface CollectionFormManagerProps {
  mode: "create" | "edit";
  editStep?: StepState;
  collectionId?: number;
  initialCollectionName?: string;
  username: string;
  onClose: () => void;
}

const CollectionFormManager = ({
  mode,
  editStep,
  collectionId,
  initialCollectionName = "",
  username,
  onClose,
}: CollectionFormManagerProps) => {
  const [step, setStep] = useState<StepState>(
    mode === "create" ? "name" : editStep ? editStep : "name",
  );
  const queryClient = useQueryClient();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName: initialCollectionName,
      selectedPictures: [],
    },
  });

  const { data: defaultCollection } = useQuery<LightCollectionByUserId>({
    queryKey: ["collection", username, "default"],
    queryFn: () => getDefaultCollectionByUsername(username),
    enabled: step === "pictures",
  });

  const createCollectionMutation = useMutation({
    mutationFn: (data: FormData) =>
      createCollectionAndAddPictures(
        data.collectionName,
        data.selectedPictures,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collections", username],
      });
      handleMutationSuccess();
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateCollectionName(collectionId!, name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collection", username, collectionId],
      });
      handleMutationSuccess();
    },
  });

  const addPicturesMutation = useMutation({
    mutationFn: (pictures: number[]) =>
      addPictureToCollectionById(collectionId!, pictures),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collection", username, collectionId],
      });
      handleMutationSuccess();
    },
  });

  const handleMutationSuccess = () => {
    onClose();
  };

  const validationName = (newName: string) => {
    const nameValidationResult = formSchema
      .pick({ collectionName: true })
      .safeParse({ collectionName: newName });

    return nameValidationResult.success;
  };

  const onSubmit = async (data: FormData) => {
    if (mode === "create") {
      if (step === "name") {
        if (validationName(data.collectionName)) setStep("pictures");
      } else {
        createCollectionMutation.mutate(data);
      }
    } else {
      if (step === "name" && data.collectionName !== initialCollectionName) {
        if (validationName(data.collectionName))
          updateNameMutation.mutate(data.collectionName);
      } else if (step === "pictures" && data.selectedPictures.length > 0) {
        addPicturesMutation.mutate(data.selectedPictures);
      }
    }
  };

  const handlePictureToggle = (picId: number) => {
    const currentSelected = methods.getValues("selectedPictures");
    const updatedSelected = currentSelected.includes(picId)
      ? currentSelected.filter((id) => id !== picId)
      : [...currentSelected, picId];
    methods.setValue("selectedPictures", updatedSelected);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === "name" && (
          <CollectionNameStep
            isLoading={mode === "edit" ? updateNameMutation.isPending : false}
          />
        )}
        {step === "pictures" && defaultCollection && (
          <SelectPicturesStep
            defaultCollection={defaultCollection}
            isLoading={
              mode === "create"
                ? createCollectionMutation.isPending
                : addPicturesMutation.isPending
            }
            onBack={mode === "create" ? () => setStep("name") : undefined}
            onPictureToggle={handlePictureToggle}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default CollectionFormManager;
