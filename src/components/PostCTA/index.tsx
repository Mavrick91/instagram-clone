"use client";

import { BookmarkIcon, HeartIcon, MessageCircle, SendIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import {
  addPictureToDefaultCollection,
  removePictureFromDefaultCollection,
} from "@/actions/collection";
import { likePicture, unlikePicture } from "@/actions/like";
import { Pluralize } from "@/components/Pluralize";
import useOptimisticTransition from "@/hooks/useOptimisticTransition";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";
import { getErrorMessage } from "@/utils";
import Modal from "../Modal";
import PostDetailsDialog from "../PostDetailsDialog";

type Props = {
  picture: UserPictureDetails;
  showMessageIcon?: boolean;
  isPictureLiked: boolean;
  isPictureAddedToCollection: boolean;
};

const revalidateOptions = {
  originalPath: `/(auth)`,
};

const PostCTA = ({
  picture,
  showMessageIcon = true,
  isPictureLiked,
  isPictureAddedToCollection,
}: Props) => {
  const user = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const [optimisticIsPictureLiked, toggleOptimisticIsPictureLiked] =
    useOptimisticTransition<boolean>(
      isPictureLiked,
      (_state, newValue: boolean) => newValue,
    );

  const [
    optimisticPictureAddedToCollection,
    toggleOptimisticPictureAddedToCollection,
  ] = useOptimisticTransition<boolean>(
    isPictureAddedToCollection,
    (_state, newValue: boolean) => newValue,
  );

  const handleClickLikePicture = useCallback(async () => {
    try {
      toggleOptimisticIsPictureLiked(!optimisticIsPictureLiked);

      if (optimisticIsPictureLiked)
        await unlikePicture(picture.id, revalidateOptions);
      else await likePicture(picture.id, revalidateOptions);
    } catch (error) {
      toast(getErrorMessage(error), { type: "error" });
    }
  }, [optimisticIsPictureLiked, picture.id, toggleOptimisticIsPictureLiked]);

  const handleClickAddToCollection = async () => {
    try {
      toggleOptimisticPictureAddedToCollection(
        !optimisticPictureAddedToCollection,
      );

      if (optimisticPictureAddedToCollection)
        await removePictureFromDefaultCollection(picture.id, revalidateOptions);
      else await addPictureToDefaultCollection(picture.id, revalidateOptions);
    } catch (error) {
      toast(getErrorMessage(error), { type: "error" });
    }
  };

  const renderLikeCount = () => {
    if (picture.hideLikesAndViewCounts) {
      if (picture.likes.some((like) => like.userId === user.id)) {
        return (
          <p className="text-sm">
            Liked by <b>{picture.user.username}</b>
            {picture.likes.length > 1 ? (
              <span>
                {" "}
                and <b>others</b>
              </span>
            ) : null}
          </p>
        );
      }

      if (picture.likes.length) {
        const firstLiker = picture.likes[0].user;
        return (
          <p className="text-sm">
            Liked by <b>{firstLiker.username}</b>
            {picture._count.likes > 1 ? " and others" : null}
          </p>
        );
      }

      return null;
    }

    if (picture._count?.likes) {
      return (
        <p className="text-sm font-semibold">
          <Pluralize count={picture._count.likes} singular="like" />
        </p>
      );
    }

    return (
      <p className="text-sm">
        Be the first one to{" "}
        <b>
          <button
            onClick={handleClickLikePicture}
            type="button"
            className="hover:text-secondary"
          >
            like this
          </button>
        </b>
      </p>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 py-2">
          <button
            className="hover:!text-secondary"
            type="button"
            onClick={handleClickLikePicture}
          >
            <HeartIcon
              className={cn("text-primary-text", {
                "text-destructive": optimisticIsPictureLiked,
                "hover:text-secondary": !optimisticIsPictureLiked,
              })}
              fill={optimisticIsPictureLiked ? "currentColor" : "none"}
            />
          </button>
          {showMessageIcon && (
            <button type="button" onClick={toggleModal}>
              <MessageCircle className="cursor-pointer text-primary-text hover:text-secondary" />
            </button>
          )}
          <SendIcon className="text-primary-text hover:text-secondary" />
        </div>
        <button type="button" onClick={handleClickAddToCollection}>
          <BookmarkIcon
            className={cn("text-primary-text", {
              "hover:text-secondary": !optimisticPictureAddedToCollection,
            })}
            fill={optimisticPictureAddedToCollection ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="text-primary-text">{renderLikeCount()}</div>

      <Modal isOpen={isOpen} onClose={toggleModal}>
        <PostDetailsDialog picture={picture} isCurrentUserFollowing />
      </Modal>
    </>
  );
};

export default PostCTA;
