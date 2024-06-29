"use client";

import { Pluralize } from "@/components/Pluralize";
import { useModal } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  commentCount: number;
  picture: UserPictureDetails;
};

const PostComments = ({ commentCount, picture }: Props) => {
  const { openModal } = useModal();

  if (commentCount === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-2">
        <button
          className="text-sm text-ig-secondary-text"
          type="button"
          onClick={() => {
            openModal("postDetailsDialog", { pictureId: picture.id });
          }}
        >
          View all <Pluralize count={commentCount} singular="comment" />
        </button>
      </div>
    </>
  );
};

export default PostComments;
