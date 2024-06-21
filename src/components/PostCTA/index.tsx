"use client";

import { BookmarkIcon, HeartIcon, MessageCircle, SendIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { toast } from "react-toastify";

import {
  addPictureToDefaultCollection,
  removePictureFromDefaultCollection,
} from "@/actions/collection";
import { likePicture, unlikePicture } from "@/actions/like";
import { Pluralize } from "@/components/Pluralize";
import useOptimisticTransition from "@/hooks/useOptimisticTransition";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { RevalidatePath } from "@/types/global";
import { UserPictureDetails } from "@/types/picture";
import { getErrorMessage } from "@/utils";

type Props = {
  picture: UserPictureDetails;
  showMessageIcon?: boolean;
  revalidatePath: RevalidatePath;
};

type LikeState = {
  isLiked: boolean;
  likeCount: number;
};

const PostCTA = ({
  picture,
  showMessageIcon = true,
  revalidatePath,
}: Props) => {
  const user = useUserInfo();
  const { showModal } = useModal();

  const [optimisticLikeState, setOptimisticLikeState, setRealLikeState] =
    useOptimisticTransition<LikeState, LikeState>(
      { isLiked: picture.isLiked, likeCount: picture._count?.likes ?? 0 },
      (_, newState) => newState,
    );

  const [optimisticSaved, setOptimisticSaved, setRealSaved] =
    useOptimisticTransition<boolean, boolean>(
      picture.isSaved,
      (_, newValue) => newValue,
    );

  const handleClickLikePicture = useCallback(async () => {
    try {
      const newLikedState = !optimisticLikeState.isLiked;
      const newLikeCount =
        optimisticLikeState.likeCount + (newLikedState ? 1 : -1);

      setOptimisticLikeState({
        isLiked: newLikedState,
        likeCount: newLikeCount,
      });

      if (newLikedState) await likePicture(picture.id, revalidatePath);
      else await unlikePicture(picture.id, revalidatePath);

      setRealLikeState({ isLiked: newLikedState, likeCount: newLikeCount });
    } catch (error) {
      toast(getErrorMessage(error), { type: "error" });
    }
  }, [
    optimisticLikeState.isLiked,
    optimisticLikeState.likeCount,
    picture.id,
    revalidatePath,
    setOptimisticLikeState,
    setRealLikeState,
  ]);

  const handleClickAddToCollection = async () => {
    try {
      const newState = !optimisticSaved;

      setOptimisticSaved(newState);

      if (optimisticSaved)
        await removePictureFromDefaultCollection(picture.id, revalidatePath);
      else await addPictureToDefaultCollection(picture.id, revalidatePath);

      setRealSaved(newState);
    } catch (error) {
      toast(getErrorMessage(error), { type: "error" });
    }
  };

  const renderLikeCount = useMemo(() => {
    if (picture.hideLikesAndViewCounts) {
      if (picture.likes.some((like) => like.userId === user.id)) {
        return (
          <p className="text-sm">
            Liked by <b>{picture.user.username}</b>
            {optimisticLikeState.likeCount > 1 ? (
              <span>
                {" "}
                and <b>others</b>
              </span>
            ) : null}
          </p>
        );
      }

      if (optimisticLikeState.likeCount) {
        const firstLiker = picture.likes[0].user;
        return (
          <p className="text-sm">
            Liked by <b>{firstLiker.username}</b>
            {optimisticLikeState.likeCount > 1 ? " and others" : null}
          </p>
        );
      }

      return null;
    }

    if (optimisticLikeState.likeCount) {
      return (
        <p className="text-sm font-semibold">
          <Pluralize count={optimisticLikeState.likeCount} singular="like" />
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
  }, [
    handleClickLikePicture,
    optimisticLikeState.likeCount,
    picture.hideLikesAndViewCounts,
    picture.likes,
    picture.user.username,
    user.id,
  ]);

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
                "text-destructive": optimisticLikeState.isLiked,
                "hover:text-secondary": !optimisticLikeState.isLiked,
              })}
              fill={optimisticLikeState.isLiked ? "currentColor" : "none"}
            />
          </button>
          {showMessageIcon && (
            <button
              type="button"
              onClick={() =>
                showModal("PostDetails", { pictureId: picture.id })
              }
            >
              <MessageCircle className="cursor-pointer text-primary-text hover:text-secondary" />
            </button>
          )}
          <SendIcon className="text-primary-text hover:text-secondary" />
        </div>
        <button type="button" onClick={handleClickAddToCollection}>
          <BookmarkIcon
            className={cn("text-primary-text", {
              "hover:text-secondary": !optimisticSaved,
            })}
            fill={optimisticSaved ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="text-primary-text">{renderLikeCount}</div>
    </>
  );
};

export default memo(PostCTA);
