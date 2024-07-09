import { users } from "@prisma/client";
import Link from "next/link";

import ButtonFollow from "@/components/ButtonFollow";
import UserListItem from "@/components/UserListItem";

type SuggestFollowListItemProps = Pick<
  users,
  "username" | "avatar" | "first_name" | "last_name" | "id"
> & {
  isFollowing: boolean;
};

const SuggestFollowListItem = ({
  username,
  avatar,
  first_name,
  last_name,
  id,
  isFollowing,
}: SuggestFollowListItemProps) => {
  return (
    <div className="flex items-center justify-between py-2 pr-6">
      <div className="flex items-center">
        <Link href={`/${username}`}>
          <UserListItem
            avatar={avatar}
            bottomText={`${first_name} ${last_name}`}
            topText={username}
            width={32}
          />
        </Link>
      </div>
      <ButtonFollow
        buttonProps={{
          variant: "primary",
        }}
        isFollowing={isFollowing}
        userProfileId={id}
        userProfileUsername={username}
      />
    </div>
  );
};

export default SuggestFollowListItem;
