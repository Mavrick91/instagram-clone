import { Prisma } from "@prisma/client";

export const createThreadSelect = {
  id: true,
};

export type NewThread = Prisma.PictureGetPayload<{
  select: typeof createThreadSelect;
}>;

export const getThreadSelect = {
  id: true,
  messages: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
        },
      },
    },
  },
  users: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  },
};

export type Thread = Prisma.ThreadGetPayload<{
  select: typeof getThreadSelect;
}>;

export type ThreadUser = Thread["users"][number];
export type ThreadMessage = Thread["messages"][number];
