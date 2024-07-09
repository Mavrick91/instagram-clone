"use server";

import { revalidatePath } from "next/cache";

import { revalidateDirect } from "@/constants/revalidate";
import prisma from "@/lib/prisma";

export const deleteThought = async (thoughtId: number) => {
  try {
    await prisma.thoughts.delete({
      where: { id: thoughtId },
    });

    revalidatePath(revalidateDirect.originalPath);
  } catch (error) {
    console.error("Error deleting thought:", error);
    throw new Error("Unable to delete thought");
  }
};

export const createThought = async (content: string, userId: number) => {
  try {
    await prisma.thoughts.create({
      data: {
        content,
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

export const updateThought = async (id: number, content: string) => {
  try {
    await prisma.thoughts.update({
      where: { id },
      data: { content },
    });

    revalidatePath(revalidateDirect.originalPath);
  } catch (error) {
    console.error("Error updating thought:", error);
    throw new Error("Unable to update thought");
  }
};
