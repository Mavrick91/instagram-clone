"use server";

import { redirect } from "next/navigation";

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

export const findExistingThread = async (
  userIds: number[],
): Promise<NewThread | null> => {
  return prisma.thread.findFirst({
    where: {
      users: {
        every: {
          id: {
            in: userIds,
          },
        },
      },
      AND: userIds.map((id) => ({ users: { some: { id } } })),
    },
    select: createThreadSelect,
  });
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

export const getOrCreateThread = async (
  userIds: number[],
): Promise<NewThread> => {
  const existingThread = await findExistingThread(userIds);
  if (existingThread) {
    return existingThread;
  }
  return createThread(userIds);
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
