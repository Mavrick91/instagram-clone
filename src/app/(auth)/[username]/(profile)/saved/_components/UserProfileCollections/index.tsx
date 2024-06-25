"use client";

import { useQuery } from "@tanstack/react-query";

import { getCollectionsByUserId } from "@/actions/collection";
import UserProfileCollectionsItem from "@/app/(auth)/[username]/(profile)/saved/_components/UserProfileCollections/UserProfileCollectionsItem";
import { LightCollectionByUserId } from "@/types/collection";

type UserProfileCollectionsProps = {
  profileUsername: string;
  userProfileId: number;
  serverCollections: LightCollectionByUserId[];
};

const UserProfileCollections = ({
  profileUsername,
  userProfileId,
  serverCollections,
}: UserProfileCollectionsProps) => {
  const { data: collections } = useQuery<LightCollectionByUserId[]>({
    queryKey: ["collections", profileUsername],
    queryFn: () => {
      return getCollectionsByUserId(userProfileId);
    },
    initialData: serverCollections,
  });

  return collections?.slice(0, 4).map((collection) => {
    return (
      <UserProfileCollectionsItem
        key={collection.nameId}
        collection={collection}
        profileUsername={profileUsername}
      />
    );
  });
};

export default UserProfileCollections;
