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
        className="relative flex max-w-[72px] flex-col items-center"
        onClick={toggleDropdown}
        data-testid="update-note-button"
      >
        <BubbleThought
          size="small"
          bubbleText={thoughtContent}
          canEdit={false}
        />
        <UserAvatar avatar={userAvatar} size="size-[72px]" />
        <span className="mt-1 break-words text-xs text-primary-text">
          {user.firstName} {user.lastName}
        </span>
      </button>

      {isDropdownOpen && (
        <EditThoughtDialog
          followersOnly
          onClose={toggleDropdown}
          ref={dropdownRef}
        />
      )}
    </div>
  );
};
