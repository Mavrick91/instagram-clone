"use client";

import { Ellipsis } from "lucide-react";

import { useModal } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";

type PostDetailsActionProps = {
  picture: UserPictureDetails;
};

const PostDetailsAction = ({ picture }: PostDetailsActionProps) => {
  const { showModal } = useModal();

  return (
    <button
      type="button"
      onClick={() => {
        return showModal("PostActionDialog", {
          picture,
        });
      }}
    >
      <Ellipsis className="text-primary-text" />
    </button>
  );
};

export default PostDetailsAction;
