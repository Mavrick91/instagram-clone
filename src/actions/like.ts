"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { RevalidatePath } from "@/types/global";

import { getCurrentUser } from "./user";

export const likePicture = async (
  pictureId: number,
  options?: RevalidatePath,
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: currentUser.id,
        pictureId: pictureId,
      },
    });

    if (existingLike) {
      throw new Error("Picture has already been liked by the user");
    }

    await prisma.like.create({
      data: {
        userId: currentUser.id,
        pictureId: pictureId,
      },
    });

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error liking the picture:", error);
    throw new Error("Unable to like the picture");
  }
};

export const unlikePicture = async (
  pictureId: number,
  options?: RevalidatePath,
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const existingLike = await prisma.like.findFirstOrThrow({
      where: {
        userId: currentUser.id,
        pictureId: pictureId,
      },
    });

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error unliking the picture:", error);
    throw new Error("Unable to unlike the picture");
  }
};

export const getIsPictureLiked = async (
  pictureId: number,
): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();

    const isLiked = await prisma.like.findFirst({
      where: {
        userId: currentUser.id,
        pictureId: pictureId,
      },
    });
    return isLiked !== null;
  } catch (error) {
    console.error(
      "Error checking if the current user has liked the picture:",
      error,
    );
    throw new Error(
      "Unable to check if the current user has liked the picture",
    );
  }
};
