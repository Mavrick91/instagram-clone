"use client";

import { Pluralize } from "@/components/Pluralize";
import { useModal } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  commentCount: number;
  picture: UserPictureDetails;
};

const PostComments = ({ commentCount, picture }: Props) => {
  const { showModal } = useModal();

  if (commentCount === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-2">
        <button
          className="text-sm text-secondary"
          type="button"
          onClick={() => {
            return showModal("PostDetails", { pictureId: picture.id });
          }}
        >
          View all <Pluralize count={commentCount} singular="comment" />
        </button>
      </div>
    </>
  );
};

export default PostComments;
