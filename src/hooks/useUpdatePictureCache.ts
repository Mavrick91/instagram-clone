import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "react-toastify";

import {
  addPictureToDefaultCollection,
  removePictureFromDefaultCollection,
} from "@/actions/collection";
import { likePicture, unlikePicture } from "@/actions/like";
import { UserPictureDetails } from "@/types/picture";
import { getErrorMessage } from "@/utils";

export const useUpdatePictureCache = (pictureId: number) => {
  const queryClient = useQueryClient();

  const updateCache = useCallback(
    (
      key: keyof UserPictureDetails,
      newValue: boolean,
      countKey?: keyof UserPictureDetails["_count"],
    ) => {
      queryClient.setQueryData<UserPictureDetails>(
        ["picture", pictureId],
        (oldData) => {
          if (!oldData) return oldData;
          const newData = { ...oldData, [key]: newValue };
          if (countKey) {
            newData._count = {
              ...oldData._count,
              [countKey]: oldData._count[countKey] + (newValue ? 1 : -1),
            };
          }
          return newData;
        },
      );
    },
    [pictureId, queryClient],
  );

  const handleAction = useCallback(
    async (
      key: keyof UserPictureDetails,
      action: () => Promise<void>,
      countKey?: keyof UserPictureDetails["_count"],
    ) => {
      const previousData = queryClient.getQueryData<UserPictureDetails>([
        "picture",
        pictureId,
      ]);

      try {
        if (!previousData) return;

        const newState = !previousData[key];
        updateCache(key, newState, countKey);
        await action();
      } catch (error) {
        toast(getErrorMessage(error), { type: "error" });
        queryClient.setQueryData(["picture", pictureId], previousData);
        await queryClient.refetchQueries({ queryKey: ["picture", pictureId] });
      }
    },
    [pictureId, queryClient, updateCache],
  );

  const handleLikePicture = useCallback(
    (isLiked: boolean) => {
      return handleAction(
        "isLiked",
        () => {
          return isLiked ? unlikePicture(pictureId) : likePicture(pictureId);
        },

        "likes",
      );
    },
    [handleAction, pictureId],
  );

  const handleAddToCollection = useCallback(
    (isSaved: boolean) => {
      return handleAction("isSaved", () => {
        return isSaved
          ? removePictureFromDefaultCollection(pictureId)
          : addPictureToDefaultCollection(pictureId);
      });
    },
    [handleAction, pictureId],
  );

  return {
    handleLikePicture,
    handleAddToCollection,
  };
};
