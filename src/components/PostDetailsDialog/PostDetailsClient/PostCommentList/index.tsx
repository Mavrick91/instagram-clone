import { forwardRef } from "react";

import { UserPictureDetails } from "@/types/picture";

import PostCommentItem from "./PostCommentItem";

type Props = {
  picture: UserPictureDetails;
};

const PostCommentList = forwardRef<HTMLDivElement, Props>(
  ({ picture }, ref) => {
    const renderComments = () => {
      return (
        <>
          {picture.description && (
            <PostCommentItem
              key={picture.id}
              avatar={picture.user.avatar}
              content={picture.description}
              createdAt={picture.created_at}
              firstName={picture.user.first_name}
              lastName={picture.user.last_name}
              username={picture.user.username}
            />
          )}
          {!picture.comments.length || picture.disable_comments ? (
            <div className="flex h-full grow flex-col items-center justify-center text-ig-primary-text">
              <span className="text-2xl font-bold">No comments yet.</span>
              <span className="mt-2 text-sm">Start the conversation.</span>
            </div>
          ) : (
            picture.comments.map((comment) => {
              return (
                <PostCommentItem
                  key={comment.id}
                  avatar={comment.user.avatar}
                  content={comment.content}
                  createdAt={comment.created_at}
                  firstName={comment.user.first_name}
                  lastName={comment.user.last_name}
                  username={comment.user.username}
                />
              );
            })
          )}
        </>
      );
    };

    return (
      <div
        ref={ref}
        className="h-0 grow space-y-2 overflow-y-auto p-3 pr-6 text-ig-primary-text"
      >
        {renderComments()}
      </div>
    );
  },
);

PostCommentList.displayName = "PostCommentList";

export default PostCommentList;
