"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import useCollectionDetails from "@/hooks/useCollectionDetails";
import { UserCollectionDetails } from "@/types/collection";

import CollectionActions from "./CollectionActions";

type UserProfileCollectionDetailsHeaderProps = {
  username: string;
  serverUserCollectionDetails: UserCollectionDetails;
};

const UserProfileCollectionDetailsHeader: React.FC<
  UserProfileCollectionDetailsHeaderProps
> = ({ username, serverUserCollectionDetails }) => {
  const { userCollectionDetails, deleteCollectionMut, isPending } =
    useCollectionDetails(username, serverUserCollectionDetails);

  return (
    <div className="mb-4">
      <BackToSavedLink username={username} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{userCollectionDetails.name}</h2>
        {!userCollectionDetails.isDefault && (
          <CollectionActions
            collectionDetails={userCollectionDetails}
            deleteCollection={deleteCollectionMut}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
};

const BackToSavedLink: React.FC<{ username: string }> = ({ username }) => {
  return (
    <Link
      href={`/${username}/saved`}
      className="mb-4 flex items-center gap-2 text-sm font-semibold text-secondary"
    >
      <ChevronLeft size={28} strokeWidth={1.25} />
      <span className="-ml-2">Saved</span>
    </Link>
  );
};

export default UserProfileCollectionDetailsHeader;
