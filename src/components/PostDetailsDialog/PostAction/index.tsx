"use client";

import { ReactNode, useState } from "react";

import { unfollowUser } from "@/actions/follow";
import Separator from "@/components/ui/separator";
import UploadPostDialog from "@/components/UploadPostDialog";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

type PostActionProps = {
  picture: UserPictureDetails;
  onClose: () => void;
};

const PostAction = ({ picture, onClose }: PostActionProps) => {
  const user = useUserInfo();
  // const [deletePicture, { loading: isDeleting }] = useDeletePicture();
  // const [updatePicture] = useUpdatePictureMutation();
  // const [unfollow] = useUnFollow();
  const [isEditPostDialogOpen, setIsEditPostDialogOpen] = useState(false);

  const handleUpdatePicture = async (
    field: "hideLikesAndViewCounts" | "disableComments",
  ) => {
    // await updatePicture({
    //   variables: {
    //     id: picture.id,
    //     input: {
    //       [field]: !picture[field],
    //     },
    //   },
    // });
  };

  const handleCloseDialog = () => {
    setIsEditPostDialogOpen(false);
  };

  const getActionButtons = () => {
    const actionButtons = [];

    if (user.id === picture.user.id) {
      actionButtons.push(
        <ActionButton
          key="delete"
          label="Delete"
          onClick={async () => {
            // await deletePicture({ variables: { id: picture.id } });
            handleCloseDialog();
          }}
          className="font-bold text-red-500"
        />,
        <ActionButton
          key="edit"
          label="Edit"
          onClick={() => setIsEditPostDialogOpen(true)}
        />,
        <ActionButton
          key="toggle-like-count"
          label={
            picture.hideLikesAndViewCounts
              ? "Unhide like count to others"
              : "Hide like count to others"
          }
          onClick={() => handleUpdatePicture("hideLikesAndViewCounts")}
        />,
        <ActionButton
          key="toggle-comments"
          label={
            picture.disableComments
              ? "Turn on commenting"
              : "Turn off commenting"
          }
          onClick={() => handleUpdatePicture("disableComments")}
        />,
      );
    } else {
      actionButtons.push(
        <ActionButton
          key="unfollow"
          label="Unfollow"
          onClick={async () => {
            await unfollowUser(picture.user.id, { originalPath: "/(auth)" });
            onClose();
          }}
          className="font-bold text-red-500"
        />,
      );
    }

    actionButtons.push(
      <ActionButton key="cancel" label="Cancel" onClick={onClose} />,
    );

    return actionButtons;
  };

  return (
    <>
      <div className="w-screen max-w-sm gap-0 rounded-lg p-0">
        {getActionButtons().map((button, index) => (
          <div key={index}>
            {button}
            {index !== getActionButtons().length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {isEditPostDialogOpen && (
        <UploadPostDialog
          onClose={handleCloseDialog}
          picture={picture}
          title="Edit info"
          buttonSubmitText="Done"
          backButton={<span>Cancel</span>}
        />
      )}
    </>
  );
};

type ActionButtonProps = {
  label: string | ReactNode;
  onClick: () => void;
  className?: string;
};

const ActionButton = ({ label, onClick, className }: ActionButtonProps) => (
  <button
    type="button"
    className={`w-full py-3.5 text-center text-sm ${className || ""}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default PostAction;
