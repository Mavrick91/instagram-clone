"use client";

import { SquarePen } from "lucide-react";

import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

const SidebarConversationHeader = () => {
  const user = useUserInfo();
  const { openModal } = useModal();

  return (
    <div className="flex items-center justify-between px-6 pb-3">
      <span className="text-xl font-bold text-ig-primary-text">
        {user.username}
      </span>
      <button onClick={() => openModal("createConversationDialog")}>
        <SquarePen className="text-ig-primary-text" />
      </button>
    </div>
  );
};

export default SidebarConversationHeader;
