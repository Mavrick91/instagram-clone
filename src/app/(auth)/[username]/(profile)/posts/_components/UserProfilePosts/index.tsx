"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

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
  const { data: pictures } = useSuspenseQuery<UserPictureDetails[]>({
    queryKey: ["user", username, "posts"],
    queryFn: () => getPicturesByUser(userProfileId),
  });

  return <ThumbnailGrid pictures={pictures} />;
};

export default UserProfilePosts;
