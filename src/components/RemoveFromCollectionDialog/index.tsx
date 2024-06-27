import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { removePictureFromCollection } from "@/actions/collection";
import { Button } from "@/components/ui/button";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import SecondaryDialogLayout from "@/layout/SecondaryDialogLayout";
import { useModal } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";
import { parseId } from "@/utils/IDParser";

type ButtonVariant = "destructive" | "ghost";

interface ActionButton {
  label: string;
  variant: ButtonVariant;
  action: () => Promise<void>;
  key: "removeFromCollection" | "removeAll";
}

interface RemoveFromCollectionDialogProps {
  title: string;
  description: string;
  collectionId?: string;
  username: string;
  pictureId: number;
}

const RemoveFromCollectionDialog = ({
  title,
  description,
  collectionId,
  pictureId,
  username,
}: RemoveFromCollectionDialogProps) => {
  const { optimisticUpdate } = useOptimisticActions();
  const { closeAllModals, closeModal } = useModal();
  const queryClient = useQueryClient();

  const removeFromCollectionMutation = useMutation({
    mutationFn: () => removePictureFromCollection(pictureId, collectionId),
    onSuccess: handleMutationSuccess,
  });

  const removeAllMutation = useMutation({
    mutationFn: () => removePictureFromCollection(pictureId, undefined),
    onSuccess: handleMutationSuccess,
  });

  async function handleMutationSuccess() {
    if (collectionId) {
      await queryClient.refetchQueries({
        queryKey: ["collection", username, parseId(collectionId)],
      });
    }
    closeAllModals();
  }

  const handleRemove = useCallback(
    (fromSpecificCollection: boolean) => async () => {
      const mutation = fromSpecificCollection
        ? removeFromCollectionMutation
        : removeAllMutation;

      await optimisticUpdate<UserPictureDetails>({
        queryKey: ["picture", pictureId],
        updateFn: (oldData) => ({
          ...oldData,
          isSaved: !oldData.isSaved,
          isInAnyCollection: fromSpecificCollection
            ? oldData.isInAnyCollection
            : false,
        }),
        action: () => mutation.mutateAsync(),
      });
    },
    [
      optimisticUpdate,
      pictureId,
      removeFromCollectionMutation,
      removeAllMutation,
    ],
  );

  const buttons: ActionButton[] = useMemo(() => {
    const baseButtons: ActionButton[] = [
      {
        key: "removeAll",
        label: "Remove",
        variant: "destructive",
        action: handleRemove(false),
      },
    ];

    if (collectionId) {
      baseButtons.unshift({
        key: "removeFromCollection",
        label: "Remove from collection",
        variant: "destructive",
        action: handleRemove(true),
      });
    }

    return baseButtons;
  }, [collectionId, handleRemove]);

  const enhancedButtons = buttons.map((button) => (
    <Button
      key={button.key}
      className="w-full py-3 text-sm"
      disabled={
        removeFromCollectionMutation.isPending || removeAllMutation.isPending
      }
      loading={
        (button.key === "removeFromCollection" &&
          removeFromCollectionMutation.isPending) ||
        (button.key === "removeAll" && removeAllMutation.isPending)
      }
      variant={button.variant}
      onClick={button.action}
    >
      {button.label}
    </Button>
  ));

  return (
    <SecondaryDialogLayout
      closeModal={() => closeModal("removeFromCollectionDialog")}
      contents={enhancedButtons}
      description={description}
      title={title}
    />
  );
};

export default RemoveFromCollectionDialog;
