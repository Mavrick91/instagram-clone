import { getUserProfile } from "@/actions/user";
import { ServerPageProps } from "@/types/global";

import UserProfilePosts from "./_components/UserProfilePosts";

const UserProfilePage = async ({ params }: ServerPageProps<"username">) => {
  const userUsername = params.username;

  const userProfile = await getUserProfile(userUsername);

  return (
    <UserProfilePosts username={userUsername} userProfileId={userProfile!.id} />
  );
};

export default UserProfilePage;
