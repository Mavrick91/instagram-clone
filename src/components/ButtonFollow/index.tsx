"use client";

import { useCallback } from "react";
import { toast } from "react-toastify";

import { followUser, unfollowUser } from "@/actions/follow";
import { Button, ButtonProps } from "@/components/ui/button";
import useOptimisticTransition from "@/hooks/useOptimisticTransition";
import { RevalidatePath } from "@/types/global";

type ButtonFollowProps = {
  isFollowing: boolean;
  targetUserId: number;
  callback?: () => void;
  className?: string;
  buttonProps?: Omit<ButtonProps, "onClick">;
  revalidateOptions?: RevalidatePath;
};

const ButtonFollow = ({
  isFollowing,
  targetUserId,
  callback,
  buttonProps,
  revalidateOptions,
}: ButtonFollowProps) => {
  const [optimisticIsFollow, updateOptimistic] =
    useOptimisticTransition<boolean>(
      isFollowing,
      (_state, newValue: boolean) => newValue,
    );

  const toggleFollowUser = useCallback(async () => {
    const newValue = !optimisticIsFollow;

    try {
      updateOptimistic(newValue);

      if (newValue) {
        await followUser(targetUserId, revalidateOptions);
      } else {
        await unfollowUser(targetUserId, revalidateOptions);
      }
    } catch (error) {
      toast("Failed to perform this action.", { type: "error" });
    }

    if (callback) {
      callback();
    }
  }, [
    updateOptimistic,
    optimisticIsFollow,
    callback,
    targetUserId,
    revalidateOptions,
  ]);

  return (
    <Button onClick={toggleFollowUser} {...buttonProps}>
      {optimisticIsFollow ? `Following` : `Follow`}
    </Button>
  );
};

export default ButtonFollow;
