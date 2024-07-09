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
  created_at: true,
  disable_comments: true,
  sizes: true,
  description: true,
  hide_likes_and_view_counts: true,
  file_name: true,
  alt_text: true,
  is_in_any_collection: true,
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
      first_name: true,
      last_name: true,
    },
  },
  likes: {
    select: {
      user_id: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  },
};

export type UserPictureDetailsSelect = Prisma.pictureGetPayload<{
  select: typeof userPictureDetailsSelect;
}>;

export type UserPictureDetails = UserPictureDetailsSelect & {
  comments: CommentsPicture[];
  is_liked: boolean;
  is_saved: boolean;
} & { sizes: Sizes };

export const pictureLightSelect = {
  id: true,
  alt_text: true,
  sizes: true,
  file_name: true,
  description: true,
  hide_likes_and_view_counts: true,
  disable_comments: true,
  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
};

export type PictureLightType = Prisma.pictureGetPayload<{
  select: typeof pictureLightSelect;
}>;
