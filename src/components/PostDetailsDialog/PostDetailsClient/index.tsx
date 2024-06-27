"use client";

import { useRef } from "react";

import useUpdateComment from "@/hooks/useUpdateComment";
import { UserPictureDetails } from "@/types/picture";

import PostCommentForm from "./PostCommentForm";
import PictureCommentList from "./PostCommentList";
import PostDetailsCTA from "./PostDetailsCTA";

type PostDetailsClientProps = {
  picture: UserPictureDetails;
};

const PostDetailsClient = ({ picture }: PostDetailsClientProps) => {
  const commentListRef = useRef<HTMLDivElement>(null);
  const { handleCreateComment } = useUpdateComment(picture.id, commentListRef);

  if (!picture) {
    return null;
  }

  return (
    <div className="flex grow flex-col">
      <PictureCommentList ref={commentListRef} picture={picture} />
      <PostDetailsCTA picture={picture} />
      {!picture.disableComments && (
        <PostCommentForm handleAddComment={handleCreateComment} />
      )}
    </div>
  );
};

export default PostDetailsClient;
