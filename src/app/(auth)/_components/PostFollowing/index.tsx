import { User } from "@prisma/client";

import { UserPictureDetails } from "@/types/picture";

import PostItem from "./PostItem";

type PostFollowingProps = {
  picturesFromFollowing: UserPictureDetails[];
  followings: User[];
};

export default function PostFollowing({
  picturesFromFollowing,
  followings,
}: PostFollowingProps) {
  return (
    <div className="space-y-4">
      {picturesFromFollowing.map((picture) => {
        return (
          <PostItem
            key={picture.id}
            picture={picture}
            followings={followings}
          />
        );
      })}
    </div>
  );
}
