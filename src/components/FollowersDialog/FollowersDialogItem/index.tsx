"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment } from "react";

import ButtonFollow from "@/components/ButtonFollow";
import UserListItem from "@/components/UserListItem";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserFollowType } from "@/types/follow";

type Props = {
  follower: UserFollowType["initiator"] | UserFollowType["targetUser"];
};

const FollowersDialogItem = ({ follower }: Props) => {
  const params = useParams();
  const user = useUserInfo();

  const isFollowingProfile = user.initiatedFollows.some((initiateFollow) => {
    return initiateFollow.targetUserId === follower.id;
  });

  return (
    <Fragment>
      <div className="-ml-2 flex items-center justify-between gap-3 px-6 py-2">
        <Link href={`/${follower.username}`}>
          <UserListItem
            avatar={follower.avatar}
            bottomText={`${follower.firstName} ${follower.lastName}`}
            topText={follower.username}
            width={44}
          />
        </Link>
        {user.id !== follower.id && (
          <ButtonFollow
            buttonProps={{
              variant: isFollowingProfile ? "gray" : "primary",
            }}
            isFollowing={isFollowingProfile}
            updateType="initiated"
            userProfileId={follower.id}
            userProfileUsername={params.username as string}
          />
        )}
      </div>
    </Fragment>
  );
};

export default FollowersDialogItem;
