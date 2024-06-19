"use server";

import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/actions/user";
import prisma from "@/lib/prisma";
import { RevalidatePath } from "@/types/global";

export const getIsCurrentUserFollowing = async (
  targetUserId: number,
): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();

    const isFollowing = await prisma.follow.findFirst({
      where: {
        initiatorId: currentUser.id,
        targetUserId: targetUserId,
      },
    });

    return isFollowing !== null;
  } catch (error) {
    console.error(
      "Error checking if the current user is following the target user:",
      error,
    );
    throw new Error(
      "Unable to check if the current user is following the target user",
    );
  }
};

export const getFollowings = async (): Promise<User[]> => {
  const currentUser = await getCurrentUser();

  const followedUsers = await prisma.follow.findMany({
    where: {
      initiatorId: currentUser.id,
    },
    select: {
      targetUser: true,
    },
  });

  return followedUsers.map((follow) => follow.targetUser);
};

export const followUser = async (
  targetUserId: number,
  options?: RevalidatePath,
) => {
  try {
    const currentUser = await getCurrentUser();

    await prisma.follow.create({
      data: {
        initiatorId: currentUser.id,
        targetUserId,
      },
    });
  } catch (error) {
    console.error("Error follow user:", error);
    throw new Error("Unable to follow.");
  }

  options && revalidatePath(options.originalPath, options?.type);
};

export const unfollowUser = async (
  targetUserId: number,
  options?: RevalidatePath,
) => {
  try {
    const currentUser = await getCurrentUser();

    await prisma.follow.deleteMany({
      where: {
        initiatorId: currentUser.id,
        targetUserId,
      },
    });
  } catch (error) {
    console.error("Error follow user:", error);
    throw new Error("Unable to unfollow.");
  }

  options && revalidatePath(options.originalPath, options?.type);
};
