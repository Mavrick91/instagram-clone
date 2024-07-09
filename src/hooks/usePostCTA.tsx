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
    is_liked,
    is_saved,
    _count,
    hide_likes_and_view_counts,
    likes,
    user: pictureUser,
    is_in_any_collection,
  } = picture;

  const handleToggleLike = useCallback(() => {
    optimisticUpdate<UserPictureDetails>({
      queryKey: ["picture", pictureId],
      updateFn: (oldData) => {
        return {
          ...oldData,
          is_liked: !oldData.is_liked,
          _count: {
            ...oldData._count,
            likes: oldData._count.likes + (oldData.is_liked ? -1 : 1),
          },
        };
      },
      action: async (oldData) => {
        if (oldData.is_liked) {
          await unlikePicture(pictureId);
        } else {
          const newNotification = await createOrUpdateNotification({
            type: "LIKE",
            senderId: currentUser.id,
            receiverId: pictureUser.id,
            pictureId: pictureId,
          });
          if (newNotification)
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
    if (!is_in_any_collection) {
      optimisticUpdate<UserPictureDetails>({
        queryKey: ["picture", pictureId],
        updateFn: (oldData) => {
          return { ...oldData, is_saved: !oldData.is_saved };
        },
        action: async (oldData) => {
          oldData.is_saved
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
    is_in_any_collection,
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
    is_liked,
    is_saved,
    handleToggleLike,
    handleToggleCollection,
    showPostDetails,
    likeCounterProps: {
      hide_likes_and_view_counts,
      likes,
      _count,
      pictureUser,
      user_id: currentUser.id,
      handleToggleLike,
    },
  };
};

export default usePostCTALogic;
