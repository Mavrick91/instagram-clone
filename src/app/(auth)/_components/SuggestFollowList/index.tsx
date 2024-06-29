"use client";

import { User } from "@prisma/client";

import { useUserInfo } from "@/providers/UserInfoProvider";
import { getIsCurrentUserFollowingProfile } from "@/utils/user";

import SuggestFollowListItem from "./SuggestFollowListItem";

type SuggestFollowListProps = {
  allUsers: User[];
};

const SuggestFollowList = ({ allUsers }: SuggestFollowListProps) => {
  const currentUser = useUserInfo();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-10 w-full max-w-[600px]">
        <h3 className="mb-5 font-semibold">Suggested for you</h3>
        {allUsers.map((user) => {
          const isFollowing = getIsCurrentUserFollowingProfile(
            currentUser,
            user.id,
          );

          return (
            <SuggestFollowListItem
              key={user.id}
              avatar={user.avatar}
              firstName={user.firstName}
              id={user.id}
              isFollowing={isFollowing}
              lastName={user.lastName}
              username={user.username}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SuggestFollowList;
