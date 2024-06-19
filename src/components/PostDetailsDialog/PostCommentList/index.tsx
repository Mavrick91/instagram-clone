import moment from "moment";
import { useMemo, useRef } from "react";

import PostCTA from "@/components/PostCTA";
import PictureCommentForm from "@/components/PostDetailsDialog/PostCommentForm";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  picture: UserPictureDetails;
};

const PostCommentList = ({ picture }: Props) => {
  const commentListRef = useRef<HTMLDivElement>(null);
  // const { data, loading, refetch } = useGetCommentsByPictureQuery({
  //   variables: { pictureId: picture.id },
  // });

  const hasComments = useMemo(() => {
    // if (!data) return false;
    // return data?.commentsByPictureId.length > 0 || picture.description;
  }, []);

  const renderComments = () => {
    // if (loading) {
    //   return <QuerySpinner size={50} className="mt-10" />;
    // }

    // if (!hasComments || picture.disableComments) {
    //   return (
    //     <div className="flex h-full grow flex-col items-center justify-center text-primary-text">
    //       <span className="text-2xl font-bold">No comments yet.</span>
    //       <span className="mt-2 text-sm">Start the conversation.</span>
    //     </div>
    //   );
    // }

    return null;
    // return (
    //   <>
    //     {picture.description && (
    //       <PostCommentItem
    //         avatar={picture.user.avatar}
    //         content={picture.description}
    //         createdAt={picture.createdAt}
    //         firstName={picture.user.firstName}
    //         lastName={picture.user.lastName}
    //         username={picture.user.username}
    //       />
    //     )}
    //     {data?.commentsByPictureId.map((comment) => (
    //       <PostCommentItem
    //         key={comment.id}
    //         avatar={comment.user.avatar}
    //         content={comment.content}
    //         username={comment.user.username}
    //         createdAt={comment.createdAt}
    //         firstName={comment.user.firstName}
    //         lastName={comment.user.lastName}
    //       />
    //     ))}
    //   </>
    // );
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
        <PostCTA picture={picture} showMessageIcon={false} />
        <span className="text-xs text-secondary">
          {moment(picture?.createdAt).format("D MMMM YYYY")}
        </span>
      </div>
      {/*{!picture.disableComments && (*/}
      {/*  <PictureCommentForm*/}
      {/*    pictureId={picture.id}*/}
      {/*    refetchCommentList={refetch}*/}
      {/*    commentListRef={commentListRef}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
};

export default PostCommentList;
