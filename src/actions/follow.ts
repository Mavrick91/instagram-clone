"use server";

import { createOrUpdateNotification } from "@/actions/notification";
import { getCurrentUser } from "@/actions/user";
import prisma from "@/lib/prisma";

export const followUser = async (targetUserId: number) => {
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
};

export const unfollowUser = async (targetUserId: number) => {
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
};
