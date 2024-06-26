import { ReactNode } from "react";

import UserAvatar from "@/components/UserAvatar";

type UserListItemProps = {
  avatar?: string | null;
  topText: string;
  bottomText: string | ReactNode;
  width: number;
};

const UserListItem = ({
  avatar,
  topText,
  bottomText,
  width,
}: UserListItemProps) => {
  return (
    <div className="flex w-full items-center overflow-hidden">
      <UserAvatar avatar={avatar} width={width} />
      <div className="ml-3 flex flex-col items-start overflow-hidden text-system-14">
        <span className="w-full truncate font-semibold">{topText}</span>
        {bottomText && (
          <span className={"w-full truncate text-left text-ig-secondary-text"}>
            {bottomText}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserListItem;
