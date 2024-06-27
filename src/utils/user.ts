import { CurrentUserType, UserProfileType } from "@/types/user";

type FollowType = {
  id: number;
  createdAt: Date;
  initiatorId: number;
  targetUserId: number;
};

export const getIsCurrentUserFollowingProfile = (
  currentUser: CurrentUserType,
  profileId: number,
): boolean => {
  return currentUser.initiatedFollows.some((initiateFollow) => {
    return initiateFollow.targetUserId === profileId;
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
    createdAt: new Date(),
    initiatorId: currentUserId,
    targetUserId,
  };

  return action === "add"
    ? [...follows, newFollow]
    : follows.filter((follow) => {
        return follow.targetUserId !== targetUserId;
      });
};

export const updateFollowCache = (
  oldData: CurrentUserType,
  targetUserId: number,
  action: "add" | "remove",
): CurrentUserType => {
  const followField = "initiatedFollows";

  return {
    ...oldData,
    initiatedFollows: updateFollows(
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
  followList: any[],
  currentUser: CurrentUserType,
  newFollowStatus: boolean,
  isReceived: boolean,
) => {
  const userField = isReceived ? "initiator" : "targetUser";

  return newFollowStatus
    ? [
        ...followList,
        {
          id: Date.now(),
          [userField]: {
            id: currentUser.id,
            avatar: currentUser.avatar,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            username: currentUser.username,
          },
        },
      ]
    : followList.filter((follow) => {
        return follow[userField].id !== currentUser.id;
      });
};

const updateCount = (
  oldCount: { [key: string]: number },
  field: string,
  increment: boolean,
) => {
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
  const followField = isReceived ? "receivedFollows" : "initiatedFollows";

  return {
    ...oldData,
    [followField]: updateFollowList(
      oldData[followField],
      currentUser,
      newFollowStatus,
      isReceived,
    ),
    _count: updateCount(oldData._count, followField, newFollowStatus),
  };
};

export const updateCountForPosts = {
  add: (oldData: UserProfileType) => ({
    ...oldData,
    _count: {
      ...oldData._count,
      pictures: oldData._count.pictures + 1,
    },
  }),
  remove: (oldData: UserProfileType) => ({
    ...oldData,
    _count: {
      ...oldData._count,
      pictures: oldData._count.pictures - 1,
    },
  }),
};
