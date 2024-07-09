"use server";

import prisma from "@/lib/prisma";

import { getCurrentUser } from "./user";

export const likePicture = async (pictureId: number): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const existingLike = await prisma.likes.findFirst({
      where: {
        user_id: currentUser.id,
        picture_id: pictureId,
      },
    });

    if (existingLike) {
      throw new Error("Picture has already been liked by the user");
    }

    await prisma.likes.create({
      data: {
        user_id: currentUser.id,
        picture_id: pictureId,
      },
    });
  } catch (error) {
    console.error("Error liking the picture:", error);
    throw new Error("Unable to like the picture");
  }
};

export const unlikePicture = async (pictureId: number): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const existingLike = await prisma.likes.findFirstOrThrow({
      where: {
        user_id: currentUser.id,
        picture_id: pictureId,
      },
    });

    await prisma.likes.delete({
      where: {
        id: existingLike.id,
      },
    });
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

    const isLiked = await prisma.likes.findFirst({
      where: {
        user_id: currentUser.id,
        picture_id: pictureId,
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
