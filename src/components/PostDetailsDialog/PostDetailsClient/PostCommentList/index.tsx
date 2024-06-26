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
              createdAt={picture.createdAt}
              firstName={picture.user.firstName}
              lastName={picture.user.lastName}
              username={picture.user.username}
            />
          )}
          {!picture.comments.length || picture.disableComments ? (
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
                  username={comment.user.username}
                  createdAt={comment.createdAt}
                  firstName={comment.user.firstName}
                  lastName={comment.user.lastName}
                />
              );
            })
          )}
        </>
      );
    };

    return (
      <div
        className="h-0 grow space-y-2 overflow-y-auto p-3 pr-6 text-ig-primary-text"
        ref={ref}
      >
        {renderComments()}
      </div>
    );
  },
);

PostCommentList.displayName = "PostCommentList";

export default PostCommentList;
