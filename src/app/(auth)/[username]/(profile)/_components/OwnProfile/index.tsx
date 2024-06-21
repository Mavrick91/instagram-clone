"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";

const OwnProfile = () => {
  const { showModal } = useModal();

  return (
    <div className="flex">
      <Button
        variant="gray"
        size="xs"
        onClick={() => {
          showModal("EditProfile");
        }}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default OwnProfile;
