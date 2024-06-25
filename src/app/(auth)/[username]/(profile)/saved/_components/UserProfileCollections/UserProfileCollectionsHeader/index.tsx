"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { LightCollectionByUserId } from "@/types/collection";

type UserProfileCollectionsHeaderProps = {
  defaultCollection?: LightCollectionByUserId;
  profileUsername: string;
};

const UserProfileCollectionsHeader = ({
  defaultCollection,
  profileUsername,
}: UserProfileCollectionsHeaderProps) => {
  const { showModal } = useModal();

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">
        {`Only you can see what you've saved`}
      </span>
      {defaultCollection && (
        <Button
          variant="blue-link"
          onClick={() => {
            return showModal("NewCollectionForm", {
              defaultCollection,
              profileUsername,
            });
          }}
        >
          + New collection
        </Button>
      )}
    </div>
  );
};

export default UserProfileCollectionsHeader;
