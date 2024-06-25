"use server";

import { Prisma } from "@prisma/client";
import moment from "moment/moment";

import { uploadFile } from "@/actions/upload";
import prisma from "@/lib/prisma";
import {
  Sizes,
  UserPictureDetails,
  userPictureDetailsSelect,
} from "@/types/picture";

import { getIsPictureInUserCollection } from "./collection";
import { getCommentsForPicture } from "./comment";
import { getIsPictureLiked } from "./like";
import { getCurrentUser } from "./user";

const createDefaultAltText = async (): Promise<string> => {
  const currentUser = await getCurrentUser();

  return `Photo by ${currentUser.firstName} ${currentUser.lastName} on ${moment().format("MMMM Do, YYYY")}. May be an image of text.`;
};

export const createPicture = async (formData: FormData): Promise<void> => {
  const currentUser = await getCurrentUser();

  const description = formData.get("description") as string;
  const altText = formData.get("altText") as string;
  const hideLikesAndViewCounts =
    formData.get("hideLikesAndViewCounts") === "true";
  const disableComments = formData.get("disableComments") === "true";

  const { fileName, sizes } = await uploadFile(formData);

  const defaultAltText = await createDefaultAltText();

  const pictureData: Prisma.PictureCreateInput = {
    user: {
      connect: { id: currentUser.id },
    },
    sizes,
    fileName,
    description,
    altText: altText || defaultAltText,
    hideLikesAndViewCounts,
    disableComments,
  };

  await prisma.picture.create({ data: pictureData });
};

export const updatePicture = async (
  pictureId: number,
  data: Record<string, string | boolean>,
) => {
  await prisma.picture.update({
    where: { id: pictureId },
    data,
  });
};

export const getPicturesByUser = async (
  userId?: number,
): Promise<UserPictureDetails[]> => {
  const pictures = await prisma.picture.findMany({
    where: { userId: userId ? userId : undefined },
    orderBy: { createdAt: "desc" },
    select: userPictureDetailsSelect,
  });

  return pictures.map((picture) => {
    return {
      ...picture,
      sizes: picture.sizes as Sizes,
    };
  });
};

export const getPictureDetails = async (
  pictureId: number,
): Promise<UserPictureDetails> => {
  const [comments, isLiked, isSaved, picture] = await Promise.all([
    getCommentsForPicture(pictureId),
    getIsPictureLiked(pictureId),
    getIsPictureInUserCollection(pictureId),
    prisma.picture.findUnique({
      where: { id: pictureId },
      select: userPictureDetailsSelect,
    }),
  ]);

  if (!picture) {
    throw new Error("Picture not found");
  }

  return {
    comments,
    isLiked,
    isSaved,
    ...picture,
    sizes: picture.sizes as Sizes,
  };
};

export const getFollowedUsersPictures = async (): Promise<
  UserPictureDetails[]
> => {
  const currentUser = await getCurrentUser();

  const whereClause = {
    user: {
      receivedFollows: {
        some: {
          initiatorId: currentUser.id,
        },
      },
    },
  };

  return prisma.picture.findMany({
    where: whereClause,
    select: userPictureDetailsSelect,
    // take: 1,
  });
};

export const deletePicture = async (pictureId: number): Promise<void> => {
  await prisma.picture.delete({
    where: { id: pictureId },
  });
};
