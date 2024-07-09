import { getCollectionsByUserId } from "@/actions/collection";
import { getUserProfile } from "@/actions/user";
import getQueryClient from "@/lib/queryClient";
import { LightCollectionByUserId } from "@/types/collection";
import { ServerPageProps } from "@/types/global";

import UserProfileCollections from "./_components/UserProfileCollections";
import UserProfileCollectionsHeader from "./_components/UserProfileCollections/UserProfileCollectionsHeader";

const SavedPage = async ({ params }: ServerPageProps<"username">) => {
  const profileUsername = params.username;
  const queryClient = getQueryClient();
  const userProfile = await getUserProfile(profileUsername);

  const collections = await queryClient.ensureQueryData<
    LightCollectionByUserId[]
  >({
    queryKey: ["collections", profileUsername],
    queryFn: () => {
      return getCollectionsByUserId(userProfile!.id);
    },
  });

  const defaultCollection = collections.find((collection) => {
    return collection.is_default;
  });

  return (
    <div className="flex flex-col gap-3">
      <UserProfileCollectionsHeader
        defaultCollection={defaultCollection}
        profileUsername={profileUsername}
      />
      <div>
        <div className="grid grid-cols-3 gap-1">
          <UserProfileCollections
            profileUsername={profileUsername}
            serverCollections={collections}
            userProfileId={userProfile.id}
          />
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
