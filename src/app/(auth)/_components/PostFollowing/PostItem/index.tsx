"use client";

import { useQuery } from "@tanstack/react-query";

import { getPictureDetails } from "@/actions/picture";
import PostCTA from "@/components/PostCTA";
import Separator from "@/components/ui/separator";
import getQueryClient from "@/lib/queryClient";
import { UserPictureDetails } from "@/types/picture";

import PostAddComment from "./PostAddComment";
import PostCaption from "./PostCaption";
import PostComments from "./PostComments";
import PostHeader from "./PostHeader";
import PostPicture from "./PostPicture";

type Props = {
  pictureId: number;
};

const PostItem = ({ pictureId }: Props) => {
  const queryClient = getQueryClient();
  const { data: picture } = useQuery<UserPictureDetails>({
    queryKey: ["picture", pictureId],
    queryFn: () => {
      return getPictureDetails(pictureId);
    },
    initialData: () => {
      return queryClient.getQueryData<UserPictureDetails>([
        "picture",
        pictureId,
      ])!;
    },
  });

  return (
    <div className="mx-auto max-w-lg">
      <PostHeader
        avatar={picture.user?.avatar}
        username={picture.user.username}
        picture={picture}
      />
      <PostPicture picture={picture} />
      <PostCTA pictureId={picture.id} />
      {!picture.disableComments && (
        <>
          <PostCaption
            description={picture.description}
            username={picture.user.username}
          />
          <PostComments
            commentCount={picture._count.comments}
            picture={picture}
          />
          <PostAddComment pictureId={picture.id} />
        </>
      )}
      <Separator className="mt-4" />
    </div>
  );
};

export default PostItem;
