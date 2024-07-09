import { Prisma } from "@prisma/client";

export const createThreadSelect: Prisma.threadSelect = {
  id: true,
};

export type NewThread = Prisma.threadGetPayload<{
  select: typeof createThreadSelect;
}>;

export const getThreadSelect: Prisma.threadSelect = {
  id: true,
  messages: {
    select: {
      id: true,
      content: true,
      thread_id: true,
      created_at: true,
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
      first_name: true,
      last_name: true,
      avatar: true,
    },
  },
};

export type Thread = Prisma.threadGetPayload<{
  select: typeof getThreadSelect;
}>;

export type ThreadUser = Thread["users"][number];
export type ThreadMessage = Thread["messages"][number];
