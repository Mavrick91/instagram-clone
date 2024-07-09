"use client";

import { useQuery } from "@tanstack/react-query";

import { getPictureDetails } from "@/actions/picture";
import PostCTA from "@/components/PostCTA";
import Separator from "@/components/ui/separator";
import { UserPictureDetails } from "@/types/picture";

import PostAddComment from "./PostAddComment";
import PostCaption from "./PostCaption";
import PostComments from "./PostComments";
import PostHeader from "./PostHeader";
import PostPicture from "./PostPicture";

type Props = {
  serverPictureDetails: UserPictureDetails;
};

const PostItem = ({ serverPictureDetails }: Props) => {
  const { data: picture } = useQuery<UserPictureDetails>({
    queryKey: ["picture", serverPictureDetails.id],
    queryFn: () => {
      return getPictureDetails(serverPictureDetails.id);
    },
    initialData: serverPictureDetails,
  });

  return (
    <div className="mx-auto max-w-lg">
      <PostHeader
        avatar={picture.user?.avatar}
        picture={picture}
        username={picture.user.username}
      />
      <PostPicture picture={picture} />
      <PostCTA pictureId={picture.id} />
      {!picture.disable_comments && (
        <>
          <PostCaption
            description={picture.description}
            username={picture.user.username}
          />
          <PostComments
            commentCount={picture._count.comments}
            picture={picture}
          />
          <PostAddComment
            pictureId={picture.id}
            pictureUserId={picture.user.id}
          />
        </>
      )}
      <Separator className="mt-4" />
    </div>
  );
};

export default PostItem;
