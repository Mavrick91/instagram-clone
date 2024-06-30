"use client";

import { useCallback } from "react";

import { followUser, unfollowUser } from "@/actions/follow";
import { createOrUpdateNotification } from "@/actions/notification";
import { Button, ButtonProps } from "@/components/ui/button";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { CurrentUserType, UserProfileType } from "@/types/user";
import {
  addFollowToCache,
  removeFollowFromCache,
  updateUserProfileFollowStatus,
} from "@/utils/user";

type ButtonFollowProps = {
  isFollowing: boolean;
  userProfileUsername: string;
  userProfileId: number;
  callback?: () => void;
  className?: string;
  buttonProps?: Omit<ButtonProps, "onClick">;
  updateType?: "received" | "initiated";
};

const ButtonFollow = ({
  isFollowing,
  userProfileId,
  userProfileUsername,
  buttonProps,
}: ButtonFollowProps) => {
  const { optimisticUpdate } = useOptimisticActions();
  const currentUser = useUserInfo();
  const { sendNotification } = useWebSocket();

  const toggleFollowUser = useCallback(async () => {
    const newValue = !isFollowing;

    await Promise.all([
      optimisticUpdate<CurrentUserType>({
        queryKey: ["user", "currentUser"],
        updateFn: (oldData) => {
          return newValue
            ? addFollowToCache(oldData, userProfileId)
            : removeFollowFromCache(oldData, userProfileId);
        },
        action: async () => {
          if (newValue) {
            await followUser(userProfileId);
            const newNotification = await createOrUpdateNotification({
              type: "FOLLOW",
              senderId: currentUser.id,
              receiverId: userProfileId,
            });
            if (newNotification)
              sendNotification(userProfileId, newNotification);
          } else {
            await unfollowUser(userProfileId);
          }
        },
        options: { refetch: currentUser.id === userProfileId },
      }),
      optimisticUpdate<UserProfileType>({
        queryKey: ["user", userProfileUsername],
        updateFn: (oldData) => {
          return updateUserProfileFollowStatus(
            oldData,
            currentUser,
            newValue,
            currentUser.username === userProfileUsername
              ? "initiated"
              : "received",
          );
        },
        options: { refetch: currentUser.id === userProfileId },
      }),
    ]);
  }, [
    currentUser,
    isFollowing,
    optimisticUpdate,
    sendNotification,
    userProfileId,
    userProfileUsername,
  ]);

  return (
    <Button onClick={toggleFollowUser} {...buttonProps}>
      {isFollowing ? `Following` : `Follow`}
    </Button>
  );
};

export default ButtonFollow;
