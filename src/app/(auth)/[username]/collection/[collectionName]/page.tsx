import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getUserCollectionDetails } from "@/actions/collection";
import getQueryClient from "@/lib/queryClient";
import { UserCollectionDetails } from "@/types/collection";
import { ServerPageProps } from "@/types/global";

import UserProfileCollectionDetails from "./_components/UserProfileCollectionDetails";

const CollectionPage = async ({
  params,
}: ServerPageProps<"username" | "collectionName">) => {
  const collectionNameId = params.collectionName;
  const username = params.username;
  const queryClient = getQueryClient();

  const serverUserCollectionDetails =
    await queryClient.ensureQueryData<UserCollectionDetails>({
      queryKey: ["collection", username, collectionNameId],
      queryFn: async () => {
        return await getUserCollectionDetails(username, collectionNameId);
      },
    });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UserProfileCollectionDetails
        serverUserCollectionDetails={serverUserCollectionDetails}
        username={username}
      />
    </HydrationBoundary>
  );
};

export default CollectionPage;
