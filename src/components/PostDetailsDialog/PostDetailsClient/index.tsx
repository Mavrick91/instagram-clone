"use client";

import { useRef } from "react";

import { createComment } from "@/actions/comment";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";

import PostCommentForm from "./PostCommentForm";
import PictureCommentList from "./PostCommentList";
import PostDetailsCTA from "./PostDetailsCTA";

type PostDetailsClientProps = {
  picture: UserPictureDetails;
};

const PostDetailsClient = ({ picture }: PostDetailsClientProps) => {
  const currentUser = useUserInfo();
  const commentListRef = useRef<HTMLDivElement>(null);
  const { optimisticUpdate } = useOptimisticActions();

  const handleAddComment = async (comment: string) => {
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

    commentListRef.current?.scroll({
      top: 0,
      behavior: "smooth",
    });

    await optimisticUpdate<UserPictureDetails>({
      queryKey: ["picture", picture.id],
      updateFn: (oldData) => {
        return {
          ...oldData,
          comments: [newComment, ...oldData.comments],
        };
      },
      action: async () => {
        await createComment(picture.id, comment);
      },
    });
  };

  if (!picture) {
    return null;
  }

  return (
    <div className="flex grow flex-col">
      <PictureCommentList picture={picture} ref={commentListRef} />
      <PostDetailsCTA picture={picture} />
      {!picture.disableComments && (
        <PostCommentForm handleAddComment={handleAddComment} />
      )}
    </div>
  );
};

export default PostDetailsClient;
