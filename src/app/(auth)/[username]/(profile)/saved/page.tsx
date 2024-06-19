import { getUserProfile } from "@/actions/user";
import { ServerPageProps } from "@/types/global";

import UserProfileCollections from "./_components/UserProfileCollections";

const SavedPage = async ({ params }: ServerPageProps<"username">) => {
  const userUsername = params.username;

  const userProfile = await getUserProfile(userUsername);

  return (
    <UserProfileCollections
      userProfileId={userProfile!.id}
      username={userUsername}
    />
  );
};

export default SavedPage;
