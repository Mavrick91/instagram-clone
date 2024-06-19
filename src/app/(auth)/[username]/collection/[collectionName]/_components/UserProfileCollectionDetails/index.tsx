import { ChevronLeft, Ellipsis } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUserCollectionDetails } from "@/actions/collection";
import ThumbnailGrid from "@/components/ThumbnailGrid";
import { UserDefaultCollectionPictures } from "@/types/collection";

import CollectionAction from "../CollectionAction";

type UserProfileCollectionDetailsProps = {
  collectionName: string;
  username: string;
  defaultCollection: UserDefaultCollectionPictures;
};

const UserProfileCollectionDetails = async ({
  collectionName,
  username,
  defaultCollection,
}: UserProfileCollectionDetailsProps) => {
  const userCollectionDetails = await getUserCollectionDetails(
    username,
    collectionName,
  );

  if (!userCollectionDetails) redirect(`/${username}/saved`);

  const pictures = userCollectionDetails.pictures.map((p) => p.picture);

  return (
    <div className="mx-auto mt-6 flex max-w-lg-page flex-col">
      <Link
        href={`/${username}/saved`}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-secondary"
      >
        <ChevronLeft size={28} strokeWidth={1.25} />{" "}
        <span className="-ml-2">Saved</span>
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="mb-3 text-xl">{userCollectionDetails.name}</h2>
        {!userCollectionDetails.isDefault && (
          <CollectionAction
            collectionId={userCollectionDetails.id}
            collectionName={userCollectionDetails.name}
            defaultCollection={defaultCollection}
          >
            <Ellipsis />
          </CollectionAction>
        )}
      </div>
      <div>
        <ThumbnailGrid pictures={pictures} />
      </div>
    </div>
  );
};

export default UserProfileCollectionDetails;
