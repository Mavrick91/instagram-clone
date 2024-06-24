"use client";

import { useMutation } from "@tanstack/react-query";
import { ReactNode } from "react";

import { unfollowUser } from "@/actions/follow";
import { deletePicture, updatePicture } from "@/actions/picture";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import getQueryClient from "@/lib/queryClient";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

export type PostActionProps = {
  picture: UserPictureDetails;
};

const PostActionDialog = ({ picture }: PostActionProps) => {
  const queryClient = getQueryClient();
  const user = useUserInfo();
  const { closeModal, closeAllModal, showModal } = useModal();
  const { optimisticUpdate } = useOptimisticActions();

  const handleUpdatePicture = async (
    field: "hideLikesAndViewCounts" | "disableComments",
  ) => {
    closeModal();
    await optimisticUpdate<UserPictureDetails>({
      queryKey: ["picture", picture.id],
      updateFn: (oldData) => {
        return {
          ...oldData,
          [field]: !oldData[field],
        };
      },
      action: async () => {
        await updatePicture(picture.id, { [field]: !picture[field] });
      },
    });
  };

  const { mutate: deletePictureMut, isPending } = useMutation({
    mutationFn: () => {
      return deletePicture(picture.id);
    },
    onSuccess: () => {
      closeAllModal();
      queryClient.removeQueries({
        queryKey: ["picture", picture.id],
      });
    },
  });

  const handleEditPicture = () => {
    closeModal();
    showModal("UploadPostDialog", {
      picture: picture,
      buttonSubmitText: "Done",
      title: "Edit info",
    });
  };

  const getActionButtons = () => {
    const actionButtons = [];

    if (user.id === picture.user.id) {
      actionButtons.push(
        <ActionButton
          key="delete"
          label="Delete"
          isLoading={isPending}
          onClick={deletePictureMut}
          className="font-bold text-red-500"
        />,
        <ActionButton key="edit" label="Edit" onClick={handleEditPicture} />,
        <ActionButton
          key="toggle-like-count"
          label={
            picture.hideLikesAndViewCounts
              ? "Unhide like count to others"
              : "Hide like count to others"
          }
          onClick={() => {
            return handleUpdatePicture("hideLikesAndViewCounts");
          }}
        />,
        <ActionButton
          key="toggle-comments"
          label={
            picture.disableComments
              ? "Turn on commenting"
              : "Turn off commenting"
          }
          onClick={() => {
            return handleUpdatePicture("disableComments");
          }}
        />,
      );
    } else {
      actionButtons.push(
        <ActionButton
          key="unfollow"
          label="Unfollow"
          onClick={async () => {
            await unfollowUser(picture.user.id);
            closeModal();
          }}
          className="font-bold text-red-500"
        />,
      );
    }

    actionButtons.push(
      <ActionButton key="cancel" label="Cancel" onClick={closeModal} />,
    );

    return actionButtons;
  };

  return (
    <>
      <div className="w-screen max-w-sm gap-0 rounded-lg p-0">
        {getActionButtons().map((button, index) => {
          return (
            <div key={index}>
              {button}
              {index !== getActionButtons().length - 1 && <Separator />}
            </div>
          );
        })}
      </div>
    </>
  );
};

type ActionButtonProps = {
  label: string | ReactNode;
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
};

const ActionButton = ({
  label,
  onClick,
  className,
  isLoading,
}: ActionButtonProps) => {
  return (
    <Button
      loading={isLoading}
      variant="ghost"
      type="button"
      className={`w-full py-3.5 text-center text-sm font-normal text-black ${className || ""}`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default PostActionDialog;
