"use client";

import { SquarePen } from "lucide-react";

import { useModalFunctions } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

const SidebarConversationHeader = () => {
  const user = useUserInfo();
  const { showModal } = useModalFunctions();

  return (
    <div className="flex items-center justify-between px-6 pb-3">
      <span className="text-xl font-bold text-primary-text">
        {user.username}
      </span>
      <button onClick={() => showModal("CreateConversation")}>
        <SquarePen className="text-primary-text" />
      </button>
    </div>
  );
};

export default SidebarConversationHeader;
