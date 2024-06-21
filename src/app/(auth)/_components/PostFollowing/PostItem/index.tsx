import { User } from "@prisma/client";

import PostCTA from "@/components/PostCTA";
import Separator from "@/components/ui/separator";
import { revalidateAuth } from "@/constants/revalidate";
import { UserPictureDetails } from "@/types/picture";

import PostAddComment from "./PostAddComment";
import PostCaption from "./PostCaption";
import PostComments from "./PostComments";
import PostHeader from "./PostHeader";
import PostPicture from "./PostPicture";

type Props = {
  picture: UserPictureDetails;
  followings: User[];
};

const PostItem = async ({ picture, followings }: Props) => {
  const isFollowingCurrentProfile = followings.some(
    (follow) => follow.id === picture.user.id,
  );

  return (
    <div className="mx-auto max-w-lg">
      <PostHeader
        avatar={picture.user?.avatar}
        username={picture.user.username}
        picture={picture}
        isFollowingCurrentProfile={isFollowingCurrentProfile}
      />
      <PostPicture picture={picture} />
      <PostCTA picture={picture} revalidatePath={revalidateAuth} />
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
          <PostAddComment
            pictureId={picture.id}
            revalidatePath={revalidateAuth}
          />
        </>
      )}
      <Separator className="mt-4" />
    </div>
  );
};

export default PostItem;
