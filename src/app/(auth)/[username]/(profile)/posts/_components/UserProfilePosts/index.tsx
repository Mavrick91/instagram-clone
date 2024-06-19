import { getPicturesLight } from "@/actions/picture";
import ThumbnailGrid from "@/components/ThumbnailGrid";

type UserProfilePostsProps = {
  userProfileId: number;
};
const UserProfilePosts = async ({ userProfileId }: UserProfilePostsProps) => {
  const userProfilePicturesLight = await getPicturesLight(userProfileId);

  return <ThumbnailGrid pictures={userProfilePicturesLight} />;
};

export default UserProfilePosts;
