import { getDefaultCollectionByUsername } from "@/actions/collection";
import { ServerPageProps } from "@/types/global";

import UserProfileCollectionDetails from "./_components/UserProfileCollectionDetails";

const CollectionPage = async ({
  params,
}: ServerPageProps<"username" | "collectionName">) => {
  const collectionName = params.collectionName;
  const username = params.username;

  const defaultCollection = await getDefaultCollectionByUsername(username);

  return (
    <UserProfileCollectionDetails
      collectionName={collectionName}
      username={username}
      defaultCollection={defaultCollection}
    />
  );
};

export default CollectionPage;
