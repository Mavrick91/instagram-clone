"use client";

import { Pluralize } from "@/components/Pluralize";
import { useModalFunctions } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  commentCount: number;
  picture: UserPictureDetails;
};

export default function PostComments({ commentCount, picture }: Props) {
  const { showModal } = useModalFunctions();

  if (commentCount === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-2">
        <button
          className="text-sm text-secondary"
          type="button"
          onClick={() => showModal("PostDetails", { pictureId: picture.id })}
        >
          View all <Pluralize count={commentCount} singular="comment" />
        </button>
      </div>
    </>
  );
}
