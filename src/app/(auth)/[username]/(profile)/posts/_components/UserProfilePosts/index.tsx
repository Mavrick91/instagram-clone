import { getPicturesByUser } from "@/actions/picture";
import ThumbnailGrid from "@/components/ThumbnailGrid";

type UserProfilePostsProps = {
  userProfileId: number;
};
const UserProfilePosts = async ({ userProfileId }: UserProfilePostsProps) => {
  const pictures = await getPicturesByUser(userProfileId);

  return <ThumbnailGrid pictures={pictures} />;
};

export default UserProfilePosts;
