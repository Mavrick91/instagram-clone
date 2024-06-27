import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { deleteCollection } from "@/actions/collection";
import { Button } from "@/components/ui/button";
import SecondaryDialogLayout from "@/layout/SecondaryDialogLayout";
import { useModal } from "@/providers/ModalProvider";

type CollectionNameActionDialogProps = {
  collectionId: number;
  username: string;
  collectionNameId: string;
  initialCollectionName: string;
};

type ActionButton = {
  label: string;
  variant: "destructive" | "ghost";
  action: () => void;
};

const CollectionDetailsActionDialog = ({
  collectionId,
  username,
  initialCollectionName,
}: CollectionNameActionDialogProps) => {
  const queryClient = useQueryClient();
  const { closeModal, openModal } = useModal();
  const router = useRouter();

  const queryKey = useMemo(
    () => ["collection", username, collectionId],
    [username, collectionId],
  );

  const { mutate: deleteCollectionMut, isPending } = useMutation({
    mutationFn: () => deleteCollection(collectionId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey });
      await queryClient.invalidateQueries({
        queryKey: ["collections", username],
      });
      closeModal("collectionNameActonDialog");
      router.back();
    },
  });

  const openCollectionFormManager = (editStep: "pictures" | "name") => {
    closeModal("collectionNameActonDialog");
    openModal("collectionFormManager", {
      mode: "edit",
      editStep,
      collectionId,
      initialCollectionName,
      username,
    });
  };

  const actionButtons: ActionButton[] = [
    {
      label: "Delete collection",
      variant: "destructive",
      action: deleteCollectionMut,
    },
    {
      label: "Add from saved",
      variant: "ghost",
      action: () => openCollectionFormManager("pictures"),
    },
    {
      label: "Edit collection",
      variant: "ghost",
      action: () => openCollectionFormManager("name"),
    },
  ];

  const enhanceOnClick = (button: ActionButton) => (
    <Button
      className="py-3"
      loading={button.label === "Delete collection" ? isPending : undefined}
      text="sm"
      variant={button.variant}
      onClick={button.action}
    >
      {button.label}
    </Button>
  );

  return (
    <SecondaryDialogLayout
      closeModal={() => closeModal("collectionNameActonDialog")}
      contents={actionButtons.map(enhanceOnClick)}
    />
  );
};

export default CollectionDetailsActionDialog;
