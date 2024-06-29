"use server";

import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  notificationTypeSelect,
  PaginatedNotifications,
} from "@/types/notification";
import { transformPictureSizes } from "@/utils/picture";

type CreateNotificationInput = {
  type: Prisma.NotificationCreateInput["type"];
  senderId: number;
  receiverId: number;
  pictureId?: number;
  commentId?: number;
};

export type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: {
    sender: true;
    receiver: true;
    comment: true;
    picture: true;
  };
}>;

export const createNotification = async (
  data: CreateNotificationInput,
): Promise<NotificationWithRelations> => {
  return prisma.notification.create({
    data: {
      type: data.type,
      sender: { connect: { id: data.senderId } },
      receiver: { connect: { id: data.receiverId } },
      ...(data.pictureId && { picture: { connect: { id: data.pictureId } } }),
      ...(data.commentId && { comment: { connect: { id: data.commentId } } }),
    },
    include: {
      sender: true,
      receiver: true,
      comment: true,
      picture: true,
    },
  });
};

export const getAllNotifications = async (
  userId: number,
  page: number,
  limit: number = 20,
): Promise<PaginatedNotifications> => {
  try {
    const skip = (page - 1) * limit;

    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: "desc" },
        select: notificationTypeSelect,
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { receiverId: userId },
      }),
    ]);

    return {
      notifications: notifications.map((notification) => ({
        ...notification,
        picture: notification.picture
          ? transformPictureSizes(notification.picture)
          : undefined,
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Failed to fetch notifications");
  }
};

export const markNotificationsAsRead = async (notificationIds: number[]) => {
  {
    await prisma.notification.updateMany({
      where: { id: { in: notificationIds } },
      data: { read: true },
    });

    return prisma.notification.findMany({
      where: { id: { in: notificationIds } },
    });
  }
};
