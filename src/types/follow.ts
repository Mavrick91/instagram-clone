import { Prisma } from "@prisma/client";

import { followInitiatorOrTargetSelect } from "@/types/user";

const userFollowTypeSelect: Prisma.followSelect = {
  id: true,
  initiator: {
    select: followInitiatorOrTargetSelect,
  },
  target_user: {
    select: followInitiatorOrTargetSelect,
  },
};

export type UserFollowType = Prisma.followGetPayload<{
  select: typeof userFollowTypeSelect;
}>;
