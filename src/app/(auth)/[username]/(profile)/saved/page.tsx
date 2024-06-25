import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
    return collection.isDefault;
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex flex-col gap-3">
        <UserProfileCollectionsHeader
          defaultCollection={defaultCollection}
          profileUsername={profileUsername}
        />
        <div>
          <div className="grid grid-cols-3 gap-1">
            <UserProfileCollections
              profileUsername={profileUsername}
              userProfileId={userProfile.id}
              serverCollections={collections}
            />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default SavedPage;
