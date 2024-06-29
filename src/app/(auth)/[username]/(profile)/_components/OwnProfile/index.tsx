"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";

const OwnProfile = () => {
  const { openModal } = useModal();

  return (
    <div className="flex">
      <Button
        variant="gray"
        onClick={() => {
          openModal("editProfileDialog");
        }}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default OwnProfile;
