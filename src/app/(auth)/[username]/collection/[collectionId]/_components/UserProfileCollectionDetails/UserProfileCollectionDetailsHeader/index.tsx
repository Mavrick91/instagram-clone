"use client";

import { ChevronLeft, Ellipsis } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { UserCollectionDetails } from "@/types/collection";

type UserProfileCollectionDetailsHeaderProps = {
  username: string;
  userCollectionDetails: UserCollectionDetails;
};

const UserProfileCollectionDetailsHeader = ({
  username,
  userCollectionDetails,
}: UserProfileCollectionDetailsHeaderProps) => {
  const { openModal } = useModal();
  return (
    <div>
      <BackToSavedLink username={username} />
      <div className="mb-1 flex min-h-10 items-center justify-between">
        <h2 className="text-xl">{userCollectionDetails.name}</h2>
        {!userCollectionDetails.is_default && (
          <Button
            variant="ghost"
            onClick={() =>
              openModal("collectionNameActonDialog", {
                collectionId: userCollectionDetails.id,
                username: username,
                initialCollectionName: userCollectionDetails.name,
              })
            }
          >
            <Ellipsis />
          </Button>
        )}
      </div>
    </div>
  );
};

const BackToSavedLink = ({ username }: { username: string }) => {
  return (
    <Link
      className="flex items-center gap-2 text-sm font-semibold text-ig-secondary-text"
      href={`/${username}/saved`}
    >
      <ChevronLeft size={28} strokeWidth={1.25} />
      <span>Saved</span>
    </Link>
  );
};

export default UserProfileCollectionDetailsHeader;
