import { RefObject, useCallback } from "react";

import { createComment } from "@/actions/comment";
import { createOrUpdateNotification } from "@/actions/notification";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

import { useOptimisticActions } from "./useOptimisticActions";

const useUpdateComment = (
  pictureId: number,
  pictureUserId: number,
  ref?: RefObject<HTMLDivElement>,
) => {
  const currentUser = useUserInfo();
  const { optimisticUpdate } = useOptimisticActions();
  const { sendNotification } = useWebSocket();

  const handleCreateComment = useCallback(
    async (comment: string) => {
      const newComment = {
        id: new Date().getTime(),
        content: comment,
        created_at: new Date(),
        user: {
          id: currentUser.id,
          username: currentUser.username,
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
          avatar: currentUser.avatar,
        },
      };

      if (ref && ref.current)
        ref.current.scroll({
          top: 0,
          behavior: "smooth",
        });

      await optimisticUpdate<UserPictureDetails>({
        queryKey: ["picture", pictureId],
        updateFn: (oldData) => {
          return {
            ...oldData,
            comments: [newComment, ...oldData.comments],
            _count: {
              ...oldData._count,
              comments: oldData._count.comments + 1,
            },
          };
        },
        action: async () => {
          const createdComment = await createComment(pictureId, comment);
          const newNotification = await createOrUpdateNotification({
            type: "COMMENT",
            senderId: currentUser.id,
            receiverId: pictureUserId,
            pictureId: pictureId,
            commentId: createdComment.id,
          });
          if (newNotification) sendNotification(pictureUserId, newNotification);
        },
      });
    },
    [
      currentUser.avatar,
      currentUser.first_name,
      currentUser.id,
      currentUser.last_name,
      currentUser.username,
      optimisticUpdate,
      pictureId,
      pictureUserId,
      ref,
      sendNotification,
    ],
  );

  return { handleCreateComment };
};

export default useUpdateComment;
