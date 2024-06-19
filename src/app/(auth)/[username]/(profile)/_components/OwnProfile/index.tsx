"use client";

import { useCallback, useState } from "react";

import EditProfileDialog from "@/components/EditProfileDialog";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

const OwnProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex">
      <Button variant="gray" size="xs" onClick={toggleModal}>
        Edit Profile
      </Button>
      <Modal isOpen={isOpen} onClose={toggleModal}>
        <EditProfileDialog />
      </Modal>
    </div>
  );
};

export default OwnProfile;
