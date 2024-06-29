"use client";

import { useClickOutside } from "@mantine/hooks";
import { useState } from "react";

import BubbleThought from "@/components/BubbleThought";
import EditThoughtDialog from "@/components/EditThoughtDialog";
import UserAvatar from "@/components/UserAvatar";
import { useUserInfo } from "@/providers/UserInfoProvider";

type Props = {
  thoughtContent?: string;
  userAvatar?: string | null;
};

export const FriendsNote = ({ thoughtContent, userAvatar }: Props) => {
  const user = useUserInfo();
  const [isOpened, setOpened] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null);
  useClickOutside(() => setOpened(false), null, [modalRef, buttonRef]);

  return (
    <div className="relative flex h-[140px] items-end px-6">
      <button
        ref={setButtonRef}
        className="relative flex max-w-[96px] flex-col items-center"
        data-testid="update-note-button"
        onClick={() => setOpened(true)}
      >
        <BubbleThought
          bubbleText={thoughtContent}
          canEdit={false}
          size="small"
        />
        <UserAvatar avatar={userAvatar} width={72} />
        <span className="mt-1 break-words text-xs text-ig-primary-text">
          {user.firstName} {user.lastName}
        </span>
      </button>

      {isOpened && (
        <EditThoughtDialog
          ref={setModalRef}
          followersOnly
          onClose={() => setOpened(false)}
        />
      )}
    </div>
  );
};
