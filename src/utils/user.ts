import { CurrentUserType } from "@/types/user";

export const getIsCurrentUserFollowingProfile = (
  currentUser: CurrentUserType,
  profileId: number,
): boolean => {
  return currentUser.initiatedFollows.some(
    (initiateFollow) => initiateFollow.targetUserId === profileId,
  );
};
