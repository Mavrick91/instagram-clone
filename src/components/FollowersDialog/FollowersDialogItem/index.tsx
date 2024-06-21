"use client";

import { Fragment, useState } from "react";

import ButtonFollow from "@/components/ButtonFollow";
import UserListItem from "@/components/UserListItem";
import { revalidateUserProfilePage } from "@/constants/revalidate";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserFollowType } from "@/types/follow";

type Props = {
  follower: UserFollowType["initiator"] | UserFollowType["targetUser"];
};

export default function FollowersDialogItem({ follower }: Props) {
  const user = useUserInfo();

  const isFollowingProfile = user.initiatedFollows.some(
    (initiateFollow) => initiateFollow.targetUserId === follower.id,
  );
  const [defaultFollow, setDefaultFollow] = useState(isFollowingProfile);

  return (
    <Fragment>
      <div className="-ml-2 flex items-center justify-between gap-3 px-6 py-2">
        <UserListItem
          avatar={follower.avatar}
          firstName={follower.username}
          subText={
            <>
              {follower.firstName} {follower.lastName}
            </>
          }
          subTextSize="sm"
        />
        {user.id !== follower.id && (
          <ButtonFollow
            buttonProps={{
              variant: defaultFollow ? "gray" : "blue",
              size: "xs",
            }}
            isFollowing={defaultFollow}
            targetUserId={follower.id}
            callback={() => setDefaultFollow(!defaultFollow)}
            revalidateOptions={revalidateUserProfilePage}
          />
        )}
      </div>
    </Fragment>
  );
}
