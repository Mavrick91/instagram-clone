import { getUserProfile } from "@/actions/user";
import { ServerPageProps } from "@/types/global";

import UserProfilePosts from "./posts/_components/UserProfilePosts";

const UserProfilePage = async ({ params }: ServerPageProps<"username">) => {
  const userUsername = params.username;

  const userProfile = await getUserProfile(userUsername);

  if (!userProfile) return null;

  return (
    <UserProfilePosts username={userUsername} userProfileId={userProfile.id} />
  );
};

export default UserProfilePage;
