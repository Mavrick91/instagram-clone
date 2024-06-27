"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { getPicturesByUser } from "@/actions/picture";
import ThumbnailGrid from "@/components/ThumbnailGrid";
import { UserPictureDetails } from "@/types/picture";

type UserProfilePostsProps = {
  userProfileId: number;
  username: string;
};
const UserProfilePosts = ({
  userProfileId,
  username,
}: UserProfilePostsProps) => {
  console.log("😀😀 username ~ ", username);
  const { data: pictures } = useSuspenseQuery<UserPictureDetails[]>({
    queryKey: ["user", username, "posts"],
    queryFn: () => getPicturesByUser(userProfileId),
  });
  console.log("😀😀 pictures ~ ", pictures);

  return <ThumbnailGrid pictures={pictures} />;
};

export default UserProfilePosts;
