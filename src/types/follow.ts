import { Prisma } from "@prisma/client";

import { followInitiatorOrTargetSelect } from "@/types/user";

const userFollowTypeSelect = {
  id: true,
  initiator: {
    select: followInitiatorOrTargetSelect,
  },
  targetUser: {
    select: followInitiatorOrTargetSelect,
  },
} as const;

export type UserFollowType = Prisma.FollowGetPayload<{
  select: typeof userFollowTypeSelect;
}>;
