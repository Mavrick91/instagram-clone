"use server";

import prisma from "@/lib/prisma";
import { CommentsPicture, commentsPictureSelect } from "@/types/comment";

import { getCurrentUser } from "./user";

export const getCommentsForPicture = async (
  pictureId: number,
): Promise<CommentsPicture[]> => {
  return prisma.comment.findMany({
    where: {
      pictureId: pictureId,
    },
    select: commentsPictureSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createComment = async (pictureId: number, content: string) => {
  try {
    const currentUser = await getCurrentUser();

    return await prisma.comment.create({
      data: {
        content,
        pictureId,
        userId: currentUser.id,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Unable to create comment");
  }
};
