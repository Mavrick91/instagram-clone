import { RefObject, useCallback } from "react";

import { createComment } from "@/actions/comment";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

import { useOptimisticActions } from "./useOptimisticActions";

const useUpdateComment = (
  pictureId: number,
  ref?: RefObject<HTMLDivElement>,
) => {
  const currentUser = useUserInfo();
  const { optimisticUpdate } = useOptimisticActions();

  const handleCreateComment = useCallback(async (comment: string) => {
    const newComment = {
      id: new Date().getTime(),
      content: comment,
      createdAt: new Date(),
      user: {
        id: currentUser.id,
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
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
        await createComment(pictureId, comment);
      },
    });
  }, []);

  return { handleCreateComment };
};

export default useUpdateComment;
