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
            bottomText={`${firstName} ${lastName}`}
            topText={username}
            width={32}
          />
        </Link>
      </div>
      <ButtonFollow
        buttonProps={{
          variant: "primary",
          rounded: "lg",
        }}
        isFollowing={isFollowing}
        userProfileId={id}
        userProfileUsername={username}
      />
    </div>
  );
};

export default SuggestFollowListItem;
