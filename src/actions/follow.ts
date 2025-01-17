"use server";

import { getCurrentUser } from "@/actions/user";
import prisma from "@/lib/prisma";

export const followUser = async (targetUserId: number) => {
  try {
    const currentUser = await getCurrentUser();

    await prisma.follows.create({
      data: {
        initiator_id: currentUser.id,
        target_user_id: targetUserId,
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

    await prisma.follows.deleteMany({
      where: {
        initiator_id: currentUser.id,
        target_user_id: targetUserId,
      },
    });
  } catch (error) {
    console.error("Error follow user:", error);
    throw new Error("Unable to unfollow.");
  }
};
