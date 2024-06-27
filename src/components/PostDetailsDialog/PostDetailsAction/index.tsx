"use client";

import { Ellipsis } from "lucide-react";

import { useModal } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";

type PostDetailsActionProps = {
  picture: UserPictureDetails;
};

const PostDetailsAction = ({ picture }: PostDetailsActionProps) => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      onClick={() => {
        return openModal("postActionDialog", {
          picture,
        });
      }}
    >
      <Ellipsis className="text-ig-primary-text" />
    </button>
  );
};

export default PostDetailsAction;
