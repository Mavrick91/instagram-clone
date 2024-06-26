import { User } from "@prisma/client";
import Link from "next/link";

import ButtonFollow from "@/components/ButtonFollow";
import UserListItem from "@/components/UserListItem";

type SuggestFollowListItemProps = Pick<
  User,
  "username" | "avatar" | "firstName" | "lastName" | "id"
> & {
  isFollowing: boolean;
};

const SuggestFollowListItem = ({
  username,
  avatar,
  firstName,
  lastName,
  id,
  isFollowing,
}: SuggestFollowListItemProps) => {
  return (
    <div className="flex items-center justify-between py-2 pr-6">
      <div className="flex items-center">
        <Link href={`/${username}`}>
          <UserListItem
            avatar={avatar}
            topText={username}
            bottomText={
              <p className="text-sm text-zinc-500">
                {firstName} {lastName}
              </p>
            }
            subTextSize="sm"
          />
        </Link>
      </div>
      <ButtonFollow
        isFollowing={isFollowing}
        userProfileId={id}
        userProfileUsername={username}
        buttonProps={{
          variant: "blue",
          size: "xs",
        }}
      />
    </div>
  );
};

export default SuggestFollowListItem;
