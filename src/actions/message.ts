"use server";

import prisma from "@/lib/prisma";
import { ThreadMessage } from "@/types/thread";

export const createMessage = async (
  content: string,
  userId: number,
  threadId: number,
): Promise<ThreadMessage> => {
  return prisma.message.create({
    data: {
      content,
      user: {
        connect: { id: userId },
      },
      thread: {
        connect: { id: threadId },
      },
    },
    include: {
      user: true,
      thread: true,
    },
  });
};
