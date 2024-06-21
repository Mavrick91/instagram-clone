import { Prisma } from "@prisma/client";

export const currentUserSelect = {
  id: true,
  avatar: true,
  username: true,
  initiatedFollows: true,
  firstName: true,
  lastName: true,
  bio: true,
  thought: {
    select: {
      id: true,
      content: true,
    },
  },
} as const;

export type CurrentUserType = Prisma.UserGetPayload<{
  select: typeof currentUserSelect;
}>;

export const followInitiatorOrTargetSelect = {
  id: true,
  username: true,
  avatar: true,
  firstName: true,
  lastName: true,
} as const;

export type FollowInitiatorOrTargetSelectType = Prisma.UserGetPayload<{
  select: typeof followInitiatorOrTargetSelect;
}>;

export const userProfileSelect = {
  id: true,
  avatar: true,
  firstName: true,
  lastName: true,
  username: true,
  bio: true,
  receivedFollows: {
    select: {
      id: true,
      initiator: {
        select: followInitiatorOrTargetSelect,
      },
    },
  },
  initiatedFollows: {
    select: {
      id: true,
      targetUser: {
        select: followInitiatorOrTargetSelect,
      },
    },
  },
  _count: {
    select: {
      pictures: true,
      receivedFollows: true,
      initiatedFollows: true,
    },
  },
} as const;

export type UserProfileType = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;

type InitiatorFollowerType = {
  initiator: NonNullable<
    UserProfileType["receivedFollows"]
  >[number]["initiator"];
};

type TargetUserFollowerType = {
  targetUser: NonNullable<
    UserProfileType["initiatedFollows"]
  >[number]["targetUser"];
};

export type FollowerType = InitiatorFollowerType | TargetUserFollowerType;
