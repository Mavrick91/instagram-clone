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
};

export type CommentsPicture = Prisma.commentsGetPayload<{
  select: typeof commentsPictureSelect;
}>;
