import { Prisma } from "@prisma/client";

export const commentsPictureSelect: Prisma.commentSelect = {
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

export type CommentsPicture = Prisma.commentGetPayload<{
  select: typeof commentsPictureSelect;
}>;
