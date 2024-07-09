import { pictures, Prisma } from "@prisma/client";

import { PictureWithSizes } from "@/types/picture";

export type NotificationType = "LIKE" | "COMMENT" | "FOLLOW";

export const notificationTypeSelect = {
  id: true,
  read: true,
  type: true,
  created_at: true,
  sender: true,
  picture: true,
  comment: true,
};

export type PrismaNotification = Omit<
  Prisma.notificationsGetPayload<{
    select: typeof notificationTypeSelect;
  }>,
  "picture"
> & {
  picture: PictureWithSizes<pictures> | undefined;
};

export type PaginatedNotifications = {
  notifications: PrismaNotification[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export type NotificationPage = {
  notifications: PrismaNotification[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export type NotificationsQueryData = {
  pages: NotificationPage[];
  pageParams: number[];
};
