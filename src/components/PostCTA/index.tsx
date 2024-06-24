"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, HeartIcon, MessageCircle, SendIcon } from "lucide-react";
import { useCallback, useMemo } from "react";

import {
  addPictureToDefaultCollection,
  removePictureFromDefaultCollection,
} from "@/actions/collection";
import { likePicture, unlikePicture } from "@/actions/like";
import { Pluralize } from "@/components/Pluralize";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  showMessageIcon?: boolean;
  pictureId: number;
};

const PostCTA = ({ pictureId, showMessageIcon = true }: Props) => {
  const user = useUserInfo();
  const { showModal } = useModal();
  const queryClient = useQueryClient();
  const { optimisticUpdate } = useOptimisticActions();

  const picture = queryClient.getQueryData<UserPictureDetails>([
    "picture",
    pictureId,
  ])!;
  const {
    isLiked,
    isSaved,
    _count,
    hideLikesAndViewCounts,
    likes,
    user: pictureUser,
  } = picture;

  const handleClickLikePicture = useCallback(async () => {
    await optimisticUpdate<UserPictureDetails>({
      queryKey: ["picture", pictureId],
      updateFn: (oldData) => {
        return {
          ...oldData,
          isLiked: !oldData.isLiked,
          _count: {
            ...oldData._count,
            likes: oldData._count.likes + (oldData.isLiked ? -1 : 1),
          },
        };
      },
      action: async (oldData) => {
        if (oldData.isLiked) {
          await unlikePicture(pictureId);
        } else {
          await likePicture(pictureId);
        }
      },
    });
  }, [pictureId, optimisticUpdate]);

  const handleClickAddToCollection = useCallback(async () => {
    await optimisticUpdate<UserPictureDetails>({
      queryKey: ["picture", pictureId],
      updateFn: (oldData) => {
        return {
          ...oldData,
          isSaved: !oldData.isSaved,
        };
      },
      action: async (oldData) => {
        if (oldData.isSaved) {
          await removePictureFromDefaultCollection(pictureId);
        } else {
          await addPictureToDefaultCollection(pictureId);
        }
      },
    });
  }, [pictureId, optimisticUpdate]);

  const renderLikeCount = useMemo(() => {
    if (hideLikesAndViewCounts) {
      if (
        likes.some((like) => {
          return like.userId === user.id;
        })
      ) {
        return (
          <p className="text-sm">
            Liked by <b>{pictureUser.username}</b>
            {_count.likes > 1 ? (
              <span>
                {" "}
                and <b>others</b>
              </span>
            ) : null}
          </p>
        );
      }

      if (likes?.[0]?.user) {
        const firstLiker = likes[0].user;
        return (
          <p className="text-sm">
            Liked by <b>{firstLiker.username}</b>
            {_count.likes > 1 ? " and others" : null}
          </p>
        );
      }

      return null;
    }

    if (_count.likes) {
      return (
        <p className="text-sm font-semibold">
          <Pluralize count={_count.likes} singular="like" />
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
    _count.likes,
    hideLikesAndViewCounts,
    likes,
    pictureUser.username,
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
                "text-destructive": isLiked,
                "hover:text-secondary": !isLiked,
              })}
              fill={isLiked ? "currentColor" : "none"}
            />
          </button>
          {showMessageIcon && (
            <button
              type="button"
              onClick={() => {
                return showModal("PostDetails", { pictureId: pictureId });
              }}
            >
              <MessageCircle className="cursor-pointer text-primary-text hover:text-secondary" />
            </button>
          )}
          <SendIcon className="text-primary-text hover:text-secondary" />
        </div>
        <button type="button" onClick={handleClickAddToCollection}>
          <BookmarkIcon
            className={cn("text-primary-text", {
              "hover:text-secondary": !isSaved,
            })}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="text-primary-text">{renderLikeCount}</div>
    </>
  );
};

export default PostCTA;
