"use client";

import BubbleThought from "@/components/BubbleThought";
import EditThoughtDialog from "@/components/EditThoughtDialog";
import UserAvatar from "@/components/UserAvatar";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useUserInfo } from "@/providers/UserInfoProvider";

type Props = {
  thoughtContent?: string;
  userAvatar?: string | null;
};

export const FriendsNote = ({ thoughtContent, userAvatar }: Props) => {
  const { isDropdownOpen, toggleDropdown, dropdownRef, buttonRef } =
    useOutsideClick();
  const user = useUserInfo();

  return (
    <div className="relative flex h-[140px] items-end px-6">
      <button
        ref={buttonRef}
        className="relative flex max-w-[96px] flex-col items-center"
        data-testid="update-note-button"
        onClick={toggleDropdown}
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

      {isDropdownOpen && (
        <EditThoughtDialog
          ref={dropdownRef}
          followersOnly
          onClose={toggleDropdown}
        />
      )}
    </div>
  );
};
