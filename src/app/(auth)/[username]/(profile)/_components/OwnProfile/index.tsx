"use client";

import { Button } from "@/components/ui/button";
import { useModalFunctions } from "@/providers/ModalProvider";

const OwnProfile = () => {
  const { showModal } = useModalFunctions();

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
