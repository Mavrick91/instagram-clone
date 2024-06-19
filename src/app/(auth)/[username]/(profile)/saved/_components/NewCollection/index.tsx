"use client";

import { useCallback, useState } from "react";

import Modal from "@/components/Modal";
import { UserDefaultCollectionPictures } from "@/types/collection";

import { Button } from "../../../../../../../components/ui/button";
import NewCollectionForm from "./NewCollectionForm";

type Props = {
  defaultCollection: UserDefaultCollectionPictures;
};

const NewCollection = ({ defaultCollection }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <Button variant="blue-link" onClick={toggleModal}>
        + New collection
      </Button>

      <Modal isOpen={isOpen} onClose={toggleModal}>
        <NewCollectionForm
          defaultCollection={defaultCollection}
          onClose={toggleModal}
        />
      </Modal>
    </>
  );
};

export default NewCollection;
