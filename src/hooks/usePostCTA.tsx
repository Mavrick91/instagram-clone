"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback } from "react";

import {
  addPictureToDefaultCollection,
  removePictureFromDefaultCollection,
} from "@/actions/collection";
import { likePicture, unlikePicture } from "@/actions/like";
import { createOrUpdateNotification } from "@/actions/notification";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

const usePostCTALogic = (pictureId: number) => {
  const currentUser = useUserInfo();
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { optimisticUpdate } = useOptimisticActions();
  const params = useParams();
  const collectionId = params.collectionId as string | undefined;
  const username = params.username as string | undefined;
  const { sendNotification } = useWebSocket();

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
    isInAnyCollection,
  } = picture;

  const handleToggleLike = useCallback(() => {
    optimisticUpdate<UserPictureDetails>({
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
          const newNotification = await createOrUpdateNotification({
            type: "LIKE",
            senderId: currentUser.id,
            receiverId: pictureUser.id,
            pictureId: pictureId,
          });
          sendNotification(pictureUser.id, newNotification);
          await likePicture(pictureId);
        }
      },
    });
  }, [
    optimisticUpdate,
    pictureId,
    currentUser.id,
    pictureUser.id,
    sendNotification,
  ]);

  const handleToggleCollection = useCallback(() => {
    if (!isInAnyCollection) {
      optimisticUpdate<UserPictureDetails>({
        queryKey: ["picture", pictureId],
        updateFn: (oldData) => {
          return { ...oldData, isSaved: !oldData.isSaved };
        },
        action: async (oldData) => {
          oldData.isSaved
            ? await removePictureFromDefaultCollection(pictureId)
            : await addPictureToDefaultCollection(pictureId);
          await queryClient.refetchQueries({
            queryKey: ["collection", currentUser.username, "default"],
          });
        },
      });
    } else {
      openModal("removeFromCollectionDialog", {
        title: "Delete records and collections?",
        description: collectionId
          ? "You can remove it from this collection or from all the items you have saved."
          : "Removing this item from records will also remove it from collections.",
        collectionId,
        pictureId,
        username,
      });
    }
  }, [
    isInAnyCollection,
    optimisticUpdate,
    pictureId,
    queryClient,
    currentUser.username,
    openModal,
    collectionId,
    username,
  ]);

  const showPostDetails = () => {
    return openModal("postDetailsDialog", { pictureId });
  };

  return {
    isLiked,
    isSaved,
    handleToggleLike,
    handleToggleCollection,
    showPostDetails,
    likeCounterProps: {
      hideLikesAndViewCounts,
      likes,
      _count,
      pictureUser,
      userId: currentUser.id,
      handleToggleLike,
    },
  };
};

export default usePostCTALogic;
