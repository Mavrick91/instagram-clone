import { Prisma } from "@prisma/client";

import { CommentsPicture } from "./comment";

export type Sizes = {
  small: string;
  medium: string;
  original: string;
  thumbnail: string;
};

export const userPictureDetailsSelect = {
  id: true,
  createdAt: true,
  disableComments: true,
  sizes: true,
  description: true,
  hideLikesAndViewCounts: true,
  fileName: true,
  altText: true,
  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
  user: {
    select: {
      id: true,
      username: true,
      avatar: true,
      firstName: true,
      lastName: true,
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
  fileName: true,
  description: true,
  hideLikesAndViewCounts: true,
  disableComments: true,
  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
} as const;

export type UserPictureDetailsSelect = Prisma.PictureGetPayload<{
  select: typeof userPictureDetailsSelect;
}>;

export type UserPictureDetails = UserPictureDetailsSelect & {
  comments: CommentsPicture[];
  isLiked: boolean;
  isSaved: boolean;
} & { sizes: Sizes };

export type PictureLightWithJsonSizes = Prisma.PictureGetPayload<{
  select: typeof pictureLightSelect;
}>;

// Final type for pictures with Sizes
export type PictureLight = Omit<PictureLightWithJsonSizes, "sizes"> & {
  sizes: Sizes;
};
