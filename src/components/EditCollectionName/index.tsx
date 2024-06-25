import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { updateCollectionName } from "@/actions/collection";
import CreateNewCollectionName from "@/components/CreateNewCollectionName";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { useModal } from "@/providers/ModalProvider";
import { UserCollectionDetails } from "@/types/collection";

const formSchema = z.object({
  collectionName: z.string().min(1, { message: "Collection name is required" }),
});

export type FormData = z.infer<typeof formSchema>;

export type EditCollectionNameProps = {
  collectionName: string;
  collectionNameId: string;
  collectionId: number;
};

export const EditCollectionName = ({
  collectionName,
  collectionId,
  collectionNameId,
}: EditCollectionNameProps) => {
  const { closeModal } = useModal();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { optimisticUpdate } = useOptimisticActions();
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName,
    },
  });

  const onSubmitEditName = async (data: { collectionName: string }) => {
    try {
      const newNameId = data.collectionName.toLowerCase().replace(/ /g, "-");

      optimisticUpdate<UserCollectionDetails>({
        queryKey: ["collection", params.username, collectionNameId],
        updateFn: (collection) => {
          return {
            ...collection,
            name: data.collectionName,
            nameId: newNameId,
          };
        },
        action: async () => {
          await updateCollectionName(collectionId, data.collectionName);
          queryClient.removeQueries({
            queryKey: ["collection", params.username, collectionNameId],
          });
          router.push(`/${params.username}/collection/${newNameId}`);
        },
      });

      closeModal();
    } catch (error) {
      if (error instanceof Error)
        toast.error("Failed to update collection's name");
    }
  };

  return (
    <FormProvider {...methods}>
      <CreateNewCollectionName
        onClickNext={methods.handleSubmit(onSubmitEditName)}
        labelSubmit="Done"
      />
    </FormProvider>
  );
};
