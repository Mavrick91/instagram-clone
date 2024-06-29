"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { unfollowUser } from "@/actions/follow";
import { deletePicture, updatePicture } from "@/actions/picture";
import { Button } from "@/components/ui/button";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import SecondaryDialogLayout from "@/layout/SecondaryDialogLayout";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";
import { updateCountForPosts } from "@/utils/user";

export type PostActionProps = {
  picture: UserPictureDetails;
};

const PostActionDialog = ({ picture }: PostActionProps) => {
  const user = useUserInfo();
  const { closeModal, closeAllModals, openModal } = useModal();
  const { optimisticUpdate } = useOptimisticActions();
  const queryClient = useQueryClient();

  const { mutate: unfollowMut, isPending: unfollowPending } = useMutation({
    mutationFn: () => deletePicture(picture.id),
    onSuccess: async () => {
      await unfollowUser(picture.user.id);
      closeModal("postActionDialog");
    },
  });

  const handleUpdatePicture = useCallback(
    async (field: "hideLikesAndViewCounts" | "disableComments") => {
      closeModal("postActionDialog");
      await optimisticUpdate<UserPictureDetails>({
        queryKey: ["picture", picture.id],
        updateFn: (oldData) => ({ ...oldData, [field]: !oldData[field] }),
        action: () => updatePicture(picture.id, { [field]: !picture[field] }),
      });
    },
    [closeModal, optimisticUpdate, picture],
  );

  const handleEditPicture = useCallback(() => {
    closeModal("postActionDialog");
    openModal("uploadPostDialog", {
      picture,
      buttonSubmitText: "Done",
      title: "Edit info",
    });
  }, [closeModal, openModal, picture]);

  const actionButtons = useMemo(() => {
    const buttons = [];

    if (user.id === picture.user.id) {
      buttons.push(
        {
          key: "delete",
          label: "Delete",
          onClick: () => {
            optimisticUpdate<UserPictureDetails[]>({
              queryKey: ["user", picture.user.username, "posts"],
              updateFn: (oldData) =>
                oldData.filter((pic) => pic.id !== picture.id),
              action: async () => {
                await deletePicture(picture.id);
                queryClient.setQueryData(
                  ["user", picture.user.username],
                  updateCountForPosts.remove,
                );
                closeAllModals();
              },
            });
          },
          destructive: true,
        },
        { key: "edit", label: "Edit", onClick: handleEditPicture },
        {
          key: "toggle-like-count",
          label: picture.hideLikesAndViewCounts
            ? "Unhide like count to others"
            : "Hide like count to others",
          onClick: () => handleUpdatePicture("hideLikesAndViewCounts"),
        },
        {
          key: "toggle-comments",
          label: picture.disableComments
            ? "Turn on commenting"
            : "Turn off commenting",
          onClick: () => handleUpdatePicture("disableComments"),
        },
      );
    } else {
      buttons.push({
        key: "unfollow",
        label: "Unfollow",
        onClick: async () => unfollowMut(),
        destructive: true,
        isLoading: unfollowPending,
      });
    }

    return buttons;
  }, [
    user.id,
    picture.user.id,
    picture.user.username,
    picture.hideLikesAndViewCounts,
    picture.disableComments,
    picture.id,
    handleEditPicture,
    optimisticUpdate,
    queryClient,
    closeAllModals,
    handleUpdatePicture,
    unfollowPending,
    unfollowMut,
  ]);

  const enhancedButtons = actionButtons.map((button) => (
    <Button
      key={button.key}
      className="py-3"
      loading={button.isLoading}
      text="sm"
      variant={button.destructive ? "destructive" : "ghost"}
      onClick={button.onClick}
    >
      {button.label}
    </Button>
  ));

  return (
    <SecondaryDialogLayout
      closeModal={() => closeModal("postActionDialog")}
      contents={enhancedButtons}
    />
  );
};

export default PostActionDialog;
