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

  return `Photo by ${currentUser.first_name} ${currentUser.last_name} on ${moment().format("MMMM Do, YYYY")}. May be an image of text.`;
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

  const pictureData: Prisma.picturesCreateInput = {
    user: {
      connect: { id: currentUser.id },
    },
    sizes,
    file_name: fileName,
    description,
    alt_text: altText || defaultAltText,
    hide_likes_and_view_counts: hideLikesAndViewCounts,
    disable_comments: disableComments,
  };

  await prisma.pictures.create({ data: pictureData });
};

export const updatePicture = async (
  pictureId: number,
  data: Record<string, string | boolean>,
) => {
  await prisma.pictures.update({
    where: { id: pictureId },
    data,
  });
};

export const getPicturesByUser = async (
  userId?: number,
): Promise<UserPictureDetails[]> => {
  const pictures = await prisma.pictures.findMany({
    where: { user_id: userId ? userId : undefined },
    orderBy: { created_at: "desc" },
    select: userPictureDetailsSelect,
    take: 12,
  });

  return await Promise.all(
    pictures.map(async (picture) => getPictureDetails(picture.id)),
  );
};

export const getPictureDetails = async (
  pictureId: number,
): Promise<UserPictureDetails> => {
  const [comments, isLiked, isSaved, picture] = await Promise.all([
    getCommentsForPicture(pictureId),
    getIsPictureLiked(pictureId),
    getIsPictureInUserCollection(pictureId),
    prisma.pictures.findUnique({
      where: { id: pictureId },
      select: userPictureDetailsSelect,
    }),
  ]);

  if (!picture) {
    throw new Error("Picture not found");
  }

  return {
    comments,
    is_liked: isLiked,
    is_saved: isSaved,
    ...picture,
    sizes: picture.sizes as Sizes,
  };
};

export const getFollowedUsersPictures = async (): Promise<
  UserPictureDetails[]
> => {
  const currentUser = await getCurrentUser();

  const pictures = await prisma.pictures.findMany({
    where: {
      user: {
        received_follows: {
          some: {
            initiator_id: currentUser.id,
          },
        },
      },
    },
    select: userPictureDetailsSelect,
  });

  return await Promise.all(
    pictures.map(async (picture) => getPictureDetails(picture.id)),
  );
};

export const deletePicture = async (pictureId: number): Promise<void> => {
  await prisma.pictures.delete({
    where: { id: pictureId },
  });
};
