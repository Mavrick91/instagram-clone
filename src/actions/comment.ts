"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { CommentsPicture, commentsPictureSelect } from "@/types/comment";
import { RevalidatePath } from "@/types/global";

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

export const createComment = async (
  pictureId: number,
  content: string,
  options?: RevalidatePath,
) => {
  try {
    const currentUser = await getCurrentUser();

    const newComment = await prisma.comment.create({
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

    options && revalidatePath(options.originalPath, options?.type);

    return newComment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Unable to create comment");
  }
};
