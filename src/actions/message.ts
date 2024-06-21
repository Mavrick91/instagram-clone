"use server";

import prisma from "@/lib/prisma";
import { broadcastMessage } from "@/lib/websocketServer";

export const createMessage = async (
  content: string,
  userId: number,
  threadId: number,
) => {
  const message = await prisma.message.create({
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

  broadcastMessage({ type: "messageAdded", message });

  return message;
};
