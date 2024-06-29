"use server";

import { getCurrentUser } from "@/actions/user";
import prisma from "@/lib/prisma";
import {
  createThreadSelect,
  getThreadSelect,
  NewThread,
  Thread,
} from "@/types/thread";

export const getThreadById = async (threadId: number): Promise<Thread> => {
  try {
    return await prisma.thread.findUniqueOrThrow({
      where: {
        id: threadId,
      },
      select: getThreadSelect,
    });
  } catch (error) {
    console.error("Error getting thread by id:", error);
    throw new Error("Unable to get thread by id");
  }
};

export const createThread = async (userIds: number[]): Promise<NewThread> => {
  return prisma.thread.create({
    data: {
      users: {
        connect: userIds.map((userId) => {
          return { id: userId };
        }),
      },
    },
    select: createThreadSelect,
  });
};

export const getThreads = async (): Promise<Thread[]> => {
  const currentUser = await getCurrentUser();

  return prisma.thread.findMany({
    where: {
      users: {
        some: {
          id: currentUser.id,
        },
      },
    },
    select: getThreadSelect,
    orderBy: {
      messages: {
        _count: "asc",
      },
    },
  });
};
