import { Prisma } from "@prisma/client";

export const commentsPictureSelect = {
  id: true,
  content: true,
  created_at: true,
  user: {
    select: {
      avatar: true,
      username: true,
      first_name: true,
      last_name: true,
    },
  },
} as const;

export type CommentsPicture = Prisma.commentGetPayload<{
  select: typeof commentsPictureSelect;
}>;
