import { Prisma } from "@prisma/client";

export const commentsPictureSelect = {
  id: true,
  content: true,
  createdAt: true,
  user: {
    select: {
      avatar: true,
      username: true,
      firstName: true,
      lastName: true,
    },
  },
} as const;

export type CommentsPicture = Prisma.CommentGetPayload<{
  select: typeof commentsPictureSelect;
}>;
