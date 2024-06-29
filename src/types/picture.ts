import { Prisma } from "@prisma/client";

import { CommentsPicture } from "./comment";

export type Sizes = {
  small: string;
  medium: string;
  original: string;
  thumbnail: string;
};

export type WithSizes = {
  sizes: Prisma.JsonValue;
  [key: string]: unknown;
};

export type PictureWithSizes<T> = T & {
  sizes: Sizes;
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
  isInAnyCollection: true,
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
};

export type UserPictureDetailsSelect = Prisma.PictureGetPayload<{
  select: typeof userPictureDetailsSelect;
}>;

export type UserPictureDetails = UserPictureDetailsSelect & {
  comments: CommentsPicture[];
  isLiked: boolean;
  isSaved: boolean;
} & { sizes: Sizes };

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
};

export type PictureLightType = Prisma.PictureGetPayload<{
  select: typeof pictureLightSelect;
}>;
