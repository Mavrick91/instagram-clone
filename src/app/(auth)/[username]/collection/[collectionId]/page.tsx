import { getUserCollectionDetails } from "@/actions/collection";
import getQueryClient from "@/lib/queryClient";
import { UserCollectionDetails } from "@/types/collection";
import { ServerPageProps } from "@/types/global";

import UserProfileCollectionDetails from "./_components/UserProfileCollectionDetails";

const CollectionPage = async ({
  params,
}: ServerPageProps<"username" | "collectionId">) => {
  const collectionId = params.collectionId;
  const username = params.username;
  const queryClient = getQueryClient();

  const serverUserCollectionDetails =
    await queryClient.ensureQueryData<UserCollectionDetails>({
      queryKey: ["collection", username, collectionId],
      queryFn: async () =>
        await getUserCollectionDetails(username, collectionId),
    });

  return (
    <UserProfileCollectionDetails
      serverUserCollectionDetails={serverUserCollectionDetails}
      username={username}
    />
  );
};

export default CollectionPage;
