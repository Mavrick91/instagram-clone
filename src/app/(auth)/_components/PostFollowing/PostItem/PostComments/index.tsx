"use client";

import { useState } from "react";

import Modal from "@/components/Modal";
import { Pluralize } from "@/components/Pluralize";
import PostDetailsDialog from "@/components/PostDetailsDialog";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  commentCount: number;
  picture: UserPictureDetails;
  isFollowingCurrentProfile: boolean;
};

export default function PostComments({
  commentCount,
  picture,
  isFollowingCurrentProfile,
}: Props) {
  const [selectedPicture, setSelectedPicture] =
    useState<UserPictureDetails | null>(null);

  const closeModal = () => {
    setSelectedPicture(null);
  };

  if (commentCount === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-2">
        <button
          className="text-sm text-secondary"
          type="button"
          onClick={() => setSelectedPicture(picture)}
        >
          View all <Pluralize count={commentCount} singular="comment" />
        </button>
      </div>

      <Modal isOpen={!!selectedPicture} onClose={closeModal}>
        <PostDetailsDialog
          picture={selectedPicture!}
          isFollowingCurrentProfile={isFollowingCurrentProfile}
        />
      </Modal>
    </>
  );
}
