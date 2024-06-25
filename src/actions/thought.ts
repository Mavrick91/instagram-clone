"use server";

import { revalidatePath } from "next/cache";

import { revalidateDirect } from "@/constants/revalidate";
import prisma from "@/lib/prisma";

export const deleteThought = async (thoughtId: number) => {
  try {
    await prisma.thought.delete({
      where: { id: thoughtId },
    });

    revalidatePath(revalidateDirect.originalPath);
  } catch (error) {
    console.error("Error deleting thought:", error);
    throw new Error("Unable to delete thought");
  }
};

export const createThought = async (
  content: string,
  userId: number,
  visibility: "FOLLOWERS" | "CLOSE_FRIENDS",
) => {
  try {
    await prisma.thought.create({
      data: {
        content,
        visibility,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    revalidatePath(revalidateDirect.originalPath);
  } catch (error) {
    console.error("Error creating thought:", error);
    throw new Error("Unable to create thought");
  }
};

export const updateThought = async (
  id: number,
  content: string,
  visibility: "FOLLOWERS" | "CLOSE_FRIENDS",
) => {
  try {
    await prisma.thought.update({
      where: { id },
      data: { content, visibility },
    });

    revalidatePath(revalidateDirect.originalPath);
  } catch (error) {
    console.error("Error updating thought:", error);
    throw new Error("Unable to update thought");
  }
};
