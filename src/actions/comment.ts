"use server";

import prisma from "@/lib/prisma";
import { CommentsPicture, commentsPictureSelect } from "@/types/comment";

import { getCurrentUser } from "./user";

export const getCommentsForPicture = async (
  pictureId: number,
): Promise<CommentsPicture[]> => {
  return prisma.comments.findMany({
    where: {
      picture_id: pictureId,
    },
    select: commentsPictureSelect,
    orderBy: {
      created_at: "desc",
    },
  });
};

export const createComment = async (pictureId: number, content: string) => {
  try {
    const currentUser = await getCurrentUser();

    return await prisma.comments.create({
      data: {
        content,
        picture_id: pictureId,
        user_id: currentUser.id,
      },
      select: {
        id: true,
        created_at: true,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Unable to create comment");
  }
};
