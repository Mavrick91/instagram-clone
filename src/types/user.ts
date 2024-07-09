import { Prisma } from "@prisma/client";

export const currentUserSelect: Prisma.usersSelect = {
  id: true,
  avatar: true,
  username: true,
  initiated_follows: true,
  received_follows: true,
  first_name: true,
  last_name: true,
  bio: true,
  _count: {
    select: {
      initiated_follows: true,
      received_follows: true,
      pictures: true,
    },
  },
  thought: {
    select: {
      id: true,
      content: true,
    },
  },
};

export type CurrentUserType = Prisma.usersGetPayload<{
  select: typeof currentUserSelect;
}>;

export const followInitiatorOrTargetSelect: Prisma.usersSelect = {
  id: true,
  username: true,
  avatar: true,
  first_name: true,
  last_name: true,
};

export type FollowInitiatorOrTargetSelectType = Prisma.usersGetPayload<{
  select: typeof followInitiatorOrTargetSelect;
}>;

export const userProfileSelect = {
  id: true,
  avatar: true,
  first_name: true,
  last_name: true,
  username: true,
  bio: true,
  received_follows: {
    select: {
      id: true,
      initiator: {
        select: followInitiatorOrTargetSelect,
      },
    },
  },
  initiated_follows: {
    select: {
      id: true,
      target_user: {
        select: followInitiatorOrTargetSelect,
      },
    },
  },
  _count: {
    select: {
      pictures: true,
      received_follows: true,
      initiated_follows: true,
    },
  },
};

export type UserProfileType = Prisma.usersGetPayload<{
  select: typeof userProfileSelect;
}>;

type InitiatorFollowerType = {
  initiator: UserProfileType["received_follows"][number]["initiator"];
};

type TargetUserFollowerType = {
  target_user: UserProfileType["initiated_follows"][number]["target_user"];
};

export type FollowerType = InitiatorFollowerType | TargetUserFollowerType;
