"use server";

import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  notificationTypeSelect,
  PaginatedNotifications,
} from "@/types/notification";
import { transformPictureSizes } from "@/utils/picture";

type CreateNotificationInput = {
  type: Prisma.notificationCreateInput["type"];
  senderId: number;
  receiverId: number;
  pictureId?: number;
  commentId?: number;
};

export type NotificationWithRelations = Prisma.notificationGetPayload<{
  include: {
    sender: true;
    receiver: true;
    comment: true;
    picture: true;
  };
}>;

export const createOrUpdateNotification = async (
  data: CreateNotificationInput,
): Promise<NotificationWithRelations | null> => {
  const { type, senderId, receiverId, pictureId, commentId } = data;

  if (senderId === receiverId) return null;

  const existingNotification = await prisma.notification.findFirst({
    where: {
      type,
      sender_id: senderId,
      receiver_id: receiverId,
      picture_id: pictureId || null,
      comment_id: commentId || null,
    },
  });

  if (existingNotification) {
    return prisma.notification.update({
      where: { id: existingNotification.id },
      data: {
        created_at: new Date(),
        read: false,
      },
      include: {
        sender: true,
        receiver: true,
        comment: true,
        picture: true,
      },
    });
  } else {
    return prisma.notification.create({
      data: {
        type,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
        ...(pictureId && { picture: { connect: { id: pictureId } } }),
        ...(commentId && { comment: { connect: { id: commentId } } }),
      },
      include: {
        sender: true,
        receiver: true,
        comment: true,
        picture: true,
      },
    });
  }
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
        where: { receiver_id: userId },
        orderBy: { created_at: "desc" },
        select: notificationTypeSelect,
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { receiver_id: userId },
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
