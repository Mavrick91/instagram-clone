"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserCollectionDetails } from "@/actions/collection";
import ThumbnailGrid from "@/components/ThumbnailGrid";
import { UserCollectionDetails } from "@/types/collection";

import UserProfileCollectionDetailsHeader from "./UserProfileCollectionDetailsHeader";

type UserProfileCollectionDetailsProps = {
  serverUserCollectionDetails: UserCollectionDetails;
  username: string;
};

const UserProfileCollectionDetails = ({
  username,
  serverUserCollectionDetails,
}: UserProfileCollectionDetailsProps) => {
  const { data: userCollectionDetails } = useQuery({
    queryKey: ["collection", username, serverUserCollectionDetails.id],
    queryFn: async () => {
      return await getUserCollectionDetails(
        username,
        serverUserCollectionDetails.id,
      );
    },
    initialData: serverUserCollectionDetails,
  });

  const pictures = userCollectionDetails.pictures.map((p) => {
    return p.picture;
  });
  return (
    <div className="mx-auto mt-6 flex max-w-lg-page flex-col">
      <UserProfileCollectionDetailsHeader
        userCollectionDetails={userCollectionDetails}
        username={username}
      />
      <div>
        <ThumbnailGrid pictures={pictures} />
      </div>
    </div>
  );
};

export default UserProfileCollectionDetails;
