"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback } from "react";

import {
  addPictureToDefaultCollection,
  removePictureFromCollection,
  removePictureFromDefaultCollection,
} from "@/actions/collection";
import { likePicture, unlikePicture } from "@/actions/like";
import { Button } from "@/components/ui/button";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

const usePostCTALogic = (pictureId: number) => {
  const user = useUserInfo();
  const { showModal, closeAllModal } = useModal();
  const queryClient = useQueryClient();
  const { optimisticUpdate } = useOptimisticActions();
  const params = useParams();
  const collectionName = params.collectionName as string | undefined;

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

  const { mutate: removeFromCollection } = useMutation({
    mutationFn: (collectionNameId?: string) => {
      return removePictureFromCollection(pictureId, collectionNameId);
    },
    onSuccess: async () => {
      const collectionNameId = collectionName?.toLowerCase().replace(/ /g, "-");
      if (collectionNameId) {
        await queryClient.refetchQueries({
          queryKey: ["collection", user.username, collectionNameId],
        });
      }
      closeAllModal();
    },
  });

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
      action: (oldData) => {
        return oldData.isLiked
          ? unlikePicture(pictureId)
          : likePicture(pictureId);
      },
    });
  }, [pictureId, optimisticUpdate]);

  const showRemoveConfirmationModal = useCallback(() => {
    const modalContent = collectionName
      ? [
          {
            label: "Remove from collection",
            action: () => {
              return optimisticUpdate<UserPictureDetails>({
                queryKey: ["picture", pictureId],
                updateFn: (oldData) => {
                  return {
                    ...oldData,
                    isSaved: !oldData.isSaved,
                  };
                },
                action: async () => {
                  return removeFromCollection(
                    collectionName.toLowerCase().replace(/ /g, "-"),
                  );
                },
              });
            },
          },
          {
            label: "Remove",
            action: async () => {
              return optimisticUpdate<UserPictureDetails>({
                queryKey: ["picture", pictureId],
                updateFn: (oldData) => {
                  return {
                    ...oldData,
                    isSaved: !oldData.isSaved,
                    isInAnyCollection: false,
                  };
                },
                action: async () => {
                  return removeFromCollection(undefined);
                },
              });
            },
          },
        ]
      : [
          {
            label: "Remove",
            action: () => {
              return optimisticUpdate<UserPictureDetails>({
                queryKey: ["picture", pictureId],
                updateFn: (oldData) => {
                  return {
                    ...oldData,
                    isSaved: !oldData.isSaved,
                    isInAnyCollection: false,
                  };
                },
                action: async () => {
                  return removeFromCollection(undefined);
                },
              });
            },
          },
        ];

    showModal("SecondaryDialog", {
      title: "Delete records and collections?",
      description: collectionName
        ? "You can remove it from this collection or from all the items you have saved."
        : "Removing this item from records will also remove it from collections.",
      contents: modalContent.map(({ label, action }) => {
        return (
          <Button
            key={label}
            variant="ghost"
            className="w-full py-3 text-sm font-bold text-destructive"
            onClick={action}
          >
            {label}
          </Button>
        );
      }),
    });
  }, [
    collectionName,
    optimisticUpdate,
    pictureId,
    removeFromCollection,
    showModal,
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
            queryKey: ["collection", user.username, "default"],
          });
        },
      });
    } else {
      showRemoveConfirmationModal();
    }
  }, [
    isInAnyCollection,
    optimisticUpdate,
    pictureId,
    queryClient,
    user.username,
    showRemoveConfirmationModal,
  ]);

  const showPostDetails = () => {
    return showModal("PostDetails", { pictureId });
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
      userId: user.id,
      handleToggleLike,
    },
  };
};

export default usePostCTALogic;
