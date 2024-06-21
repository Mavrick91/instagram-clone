import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { updateCollectionName } from "@/actions/collection";
import CreateNewCollectionName from "@/components/CreateNewCollectionName";
import { revalidateCollectionPage } from "@/constants/revalidate";

const formSchema = z.object({
  collectionName: z.string().min(1, { message: "Collection name is required" }),
});

export type FormData = z.infer<typeof formSchema>;

type EditCollectionNameProps = {
  collectionName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  collectionId: number;
};

export const EditCollectionName = ({
  collectionName,
  isOpen,
  setIsOpen,
  collectionId,
}: EditCollectionNameProps) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName,
    },
  });

  const onSubmitEditName = async (data: { collectionName: string }) => {
    try {
      await updateCollectionName(
        collectionId,
        data.collectionName,
        revalidateCollectionPage,
      );
      setIsOpen(false);
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
