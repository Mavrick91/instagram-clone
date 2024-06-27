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
  const { openModal, closeAllModals } = useModal();

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">
        {`Only you can see what you've saved`}
      </span>
      {defaultCollection && (
        <Button
          variant="primary-ghost"
          onClick={() =>
            openModal("collectionFormManager", {
              mode: "create",
              username: profileUsername,
              onClose: closeAllModals,
            })
          }
        >
          + New collection
        </Button>
      )}
    </div>
  );
};

export default UserProfileCollectionsHeader;
