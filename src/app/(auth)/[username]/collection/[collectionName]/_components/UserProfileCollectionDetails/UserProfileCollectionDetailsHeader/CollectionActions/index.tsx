import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { UserCollectionDetails } from "@/types/collection";

type CollectionActionsProps = {
  collectionDetails: UserCollectionDetails;
  deleteCollection: () => void;
  isPending: boolean;
};

const CollectionActions = ({
  collectionDetails,
  deleteCollection,
  isPending,
}: CollectionActionsProps) => {
  const { showModal, closeModal } = useModal();

  const handleEllipsisClick = () => {
    showModal("SecondaryDialog", {
      contents: [
        <DeleteButton
          key="delete"
          deleteCollection={deleteCollection}
          isPending={isPending}
        />,
        <AddFromSavedButton
          key="add"
          collectionDetails={collectionDetails}
          closeModal={closeModal}
        />,
        <EditCollectionButton
          key="edit"
          collectionDetails={collectionDetails}
          closeModal={closeModal}
        />,
      ],
    });
  };

  return (
    <Button
      variant="ghost"
      className="text-black"
      onClick={handleEllipsisClick}
    >
      <Ellipsis />
    </Button>
  );
};

const DeleteButton: React.FC<{
  deleteCollection: () => void;
  isPending: boolean;
}> = ({ deleteCollection, isPending }) => {
  return (
    <Button
      variant="ghost"
      loading={isPending}
      className="font-bold text-red-500"
      onClick={deleteCollection}
    >
      Delete collection
    </Button>
  );
};

const AddFromSavedButton: React.FC<{
  collectionDetails: UserCollectionDetails;
  closeModal: () => void;
}> = ({ collectionDetails, closeModal }) => {
  const { showModal } = useModal();

  const handleClick = () => {
    closeModal();
    showModal("AddPicturesDialog", {
      collectionId: collectionDetails.id,
      collectionNameId: collectionDetails.name,
    });
  };

  return (
    <Button
      variant="ghost"
      className="font-normal text-black"
      onClick={handleClick}
    >
      Add from saved
    </Button>
  );
};

const EditCollectionButton: React.FC<{
  collectionDetails: UserCollectionDetails;
  closeModal: () => void;
}> = ({ collectionDetails, closeModal }) => {
  const { showModal } = useModal();

  const handleClick = () => {
    closeModal();
    showModal("EditCollectionName", {
      collectionId: collectionDetails.id,
      collectionName: collectionDetails.name,
      collectionNameId: collectionDetails.nameId,
    });
  };

  return (
    <Button
      variant="ghost"
      className="font-normal text-black"
      onClick={handleClick}
    >
      Edit collection
    </Button>
  );
};

export default CollectionActions;
