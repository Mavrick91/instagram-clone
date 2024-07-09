import { CurrentUserType, UserProfileType } from "@/types/user";

type FollowType = {
  id: number;
  created_at: Date;
  initiator_id: number;
  target_user_id: number;
};

type UserSummary = {
  id: number;
  avatar: string | null;
  first_name: string;
  last_name: string;
  username: string;
};

type FollowListItem = {
  id: number;
  initiator?: UserSummary;
  target_user?: UserSummary;
};

type CountType = {
  pictures: number;
  initiated_follows: number;
  received_follows: number;
};

export const getIsCurrentUserFollowingProfile = (
  currentUser: CurrentUserType,
  profileId: number,
): boolean => {
  return currentUser.initiated_follows.some((initiateFollow) => {
    return initiateFollow.target_user_id === profileId;
  });
};

const updateFollows = (
  currentUserId: number,
  follows: FollowType[],
  targetUserId: number,
  action: "add" | "remove",
): FollowType[] => {
  const newFollow: FollowType = {
    id: Date.now(),
    created_at: new Date(),
    initiator_id: currentUserId,
    target_user_id: targetUserId,
  };

  return action === "add"
    ? [...follows, newFollow]
    : follows.filter((follow) => {
        return follow.target_user_id !== targetUserId;
      });
};

export const updateFollowCache = (
  oldData: CurrentUserType,
  targetUserId: number,
  action: "add" | "remove",
): CurrentUserType => {
  const followField = "initiated_follows";

  return {
    ...oldData,
    initiated_follows: updateFollows(
      oldData.id,
      oldData[followField],
      targetUserId,
      action,
    ),
    _count: {
      ...oldData._count,
      [followField]: oldData._count[followField] + (action === "add" ? 1 : -1),
    },
  };
};

export const addFollowToCache = (
  oldData: CurrentUserType,
  targetUserId: number,
): CurrentUserType => {
  return updateFollowCache(oldData, targetUserId, "add");
};

export const removeFollowFromCache = (
  oldData: CurrentUserType,
  targetUserId: number,
): CurrentUserType => {
  return updateFollowCache(oldData, targetUserId, "remove");
};

const updateFollowList = (
  followList: FollowListItem[],
  currentUser: CurrentUserType,
  newFollowStatus: boolean,
  isReceived: boolean,
): FollowListItem[] => {
  const userField = isReceived ? "initiator" : "target_user";

  return newFollowStatus
    ? [
        ...followList,
        {
          id: Date.now(),
          [userField]: {
            id: currentUser.id,
            avatar: currentUser.avatar,
            firstName: currentUser.first_name,
            lastName: currentUser.last_name,
            username: currentUser.username,
          },
        },
      ]
    : followList.filter((follow) => {
        return follow[userField]?.id !== currentUser.id;
      });
};

const updateCount = (
  oldCount: CountType,
  field: keyof CountType,
  increment: boolean,
): CountType => {
  return {
    ...oldCount,
    [field]: oldCount[field] + (increment ? 1 : -1),
  };
};

export const updateUserProfileFollowStatus = (
  oldData: UserProfileType,
  currentUser: CurrentUserType,
  newFollowStatus: boolean,
  updateType: "received" | "initiated",
): UserProfileType => {
  const isReceived = updateType === "received";
  const followField = isReceived ? "received_follows" : "initiated_follows";

  return {
    ...oldData,
    [followField]: updateFollowList(
      oldData[followField],
      currentUser,
      newFollowStatus,
      isReceived,
    ),
    _count: updateCount(
      oldData._count,
      followField as keyof CountType,
      newFollowStatus,
    ),
  };
};

export const updateCountForPosts = {
  add: (oldData: CurrentUserType): CurrentUserType => ({
    ...oldData,
    _count: {
      ...oldData._count,
      pictures: oldData._count.pictures + 1,
    },
  }),
  remove: (oldData: CurrentUserType): CurrentUserType => ({
    ...oldData,
    _count: {
      ...oldData._count,
      pictures: oldData._count.pictures - 1,
    },
  }),
};
