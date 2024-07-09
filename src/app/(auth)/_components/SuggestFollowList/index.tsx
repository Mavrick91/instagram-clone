"use client";

import { users } from "@prisma/client";

import { useUserInfo } from "@/providers/UserInfoProvider";
import { getIsCurrentUserFollowingProfile } from "@/utils/user";

import SuggestFollowListItem from "./SuggestFollowListItem";

type SuggestFollowListProps = {
  allUsers: users[];
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
              first_name={user.first_name}
              id={user.id}
              isFollowing={isFollowing}
              last_name={user.last_name}
              username={user.username}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SuggestFollowList;
