"use server";

import prisma from "@/lib/prisma";
import { RevalidatePath } from "@/types/global";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user";

export const getCommentsForPicture = async (pictureId: number) => {
  try {
    return await prisma.comment.findMany({
      where: {
        pictureId: pictureId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error getting comments for the picture:", error);
    throw new Error("Unable to get comments for the picture");
  }
};

export const createComment = async (
  pictureId: number,
  content: string,
  options?: RevalidatePath,
) => {
  try {
    const currentUser = await getCurrentUser();

    await prisma.comment.create({
      data: {
        content,
        pictureId,
        userId: currentUser.id,
      },
    });

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Unable to create comment");
  }
};
