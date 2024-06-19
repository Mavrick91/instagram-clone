import { Prisma } from "@prisma/client";

export type Sizes = {
  small: string;
  medium: string;
  original: string;
  thumbnail: string;
};

export type ExtendPictureWithSizes<T> = Omit<T, "sizes"> & { sizes: Sizes };

const userPictureDetailsSelect = {
  id: true,
  createdAt: true,
  disableComments: true,
  description: true,
  hideLikesAndViewCounts: true,
  altText: true,
  sizes: true,
  user: {
    select: {
      id: true,
      username: true,
      avatar: true,
      firstName: true,
      lastName: true,
    },
  },
  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
  likes: {
    select: {
      userId: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  },
} as const;

export const pictureLightSelect = {
  id: true,
  altText: true,
  sizes: true,
  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
} as const;

export type UserPictureDetails = Prisma.PictureGetPayload<{
  select: typeof userPictureDetailsSelect;
}>;

export type PictureLight = Prisma.PictureGetPayload<{
  select: typeof pictureLightSelect;
}> & {
  sizes: Sizes;
};
