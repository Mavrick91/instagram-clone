import moment from "moment";
import { useRef } from "react";

import { createComment } from "@/actions/comment";
import PostCTA from "@/components/PostCTA";
import { revalidateAuth } from "@/constants/revalidate";
import useOptimisticTransition from "@/hooks/useOptimisticTransition";
import { CommentsPicture } from "@/types/comment";
import { UserPictureDetails } from "@/types/picture";

import PostCommentForm from "../PostCommentForm";
import PostCommentItem from "../PostCommentItem";

type Props = {
  picture: UserPictureDetails;
};

const PostCommentList = ({ picture }: Props) => {
  const commentListRef = useRef<HTMLDivElement>(null);

  const [
    optimisticComments,
    setOptimisticComments,
    setRealComments,
    realComments,
  ] = useOptimisticTransition<CommentsPicture[], CommentsPicture>(
    picture.comments,
    (state, newValue) => [newValue, ...state],
  );

  const hasComments = picture.comments.length > 0;

  const renderComments = () => {
    if (!hasComments || picture.disableComments) {
      return (
        <div className="flex h-full grow flex-col items-center justify-center text-primary-text">
          <span className="text-2xl font-bold">No comments yet.</span>
          <span className="mt-2 text-sm">Start the conversation.</span>
        </div>
      );
    }

    return (
      <>
        {picture.description && (
          <PostCommentItem
            key={picture.id}
            avatar={picture.user.avatar}
            content={picture.description}
            createdAt={picture.createdAt}
            firstName={picture.user.firstName}
            lastName={picture.user.lastName}
            username={picture.user.username}
          />
        )}
        {optimisticComments.map((comment) => (
          <PostCommentItem
            key={comment.id}
            avatar={comment.user.avatar}
            content={comment.content}
            username={comment.user.username}
            createdAt={comment.createdAt}
            firstName={comment.user.firstName}
            lastName={comment.user.lastName}
          />
        ))}
      </>
    );
  };

  const handleAddComment = async (comment: string) => {
    const newComment = {
      id: new Date().getTime(),
      content: comment,
      createdAt: new Date(),
      user: {
        id: picture.currentUser.id,
        username: picture.currentUser.username,
        firstName: picture.currentUser.firstName,
        lastName: picture.currentUser.lastName,
        avatar: picture.currentUser.avatar,
      },
    };

    setOptimisticComments(newComment);

    const result = await createComment(picture.id, comment, revalidateAuth);

    newComment.id = result.id;
    newComment.createdAt = result.createdAt;

    const newComments = [newComment, ...realComments] as CommentsPicture[];

    setRealComments(newComments);
  };

  return (
    <div className="flex grow flex-col">
      <div
        className="h-0 grow space-y-2 overflow-y-auto p-3 pr-6 text-primary-text"
        ref={commentListRef}
      >
        {renderComments()}
      </div>
      <div className="border-t border-separator p-3 pt-1.5">
        <PostCTA
          picture={picture}
          showMessageIcon={false}
          revalidatePath={revalidateAuth}
        />
        <span className="text-xs text-secondary">
          {moment(picture.createdAt).format("D MMMM YYYY")}
        </span>
      </div>
      {!picture.disableComments && (
        <PostCommentForm
          handleAddComment={handleAddComment}
          commentListRef={commentListRef}
        />
      )}
    </div>
  );
};

export default PostCommentList;
