"use server";

import { withCache } from "@/lib/lru";
import prisma from "@/lib/prisma";
import {
  PictureLight,
  pictureLightSelect,
  Sizes,
  UserPictureDetails,
  userPictureDetailsSelect,
} from "@/types/picture";
import { CurrentUserType } from "@/types/user";
import { getIsCurrentUserFollowingProfile } from "@/utils/user";

import { getIsPictureInUserCollection } from "./collection";
import { getCommentsForPicture } from "./comment";
import { getIsPictureLiked } from "./like";
import { getCurrentUser } from "./user";

export const getPicturesLight = async (
  userId?: number,
): Promise<PictureLight[]> => {
  const keyGenerator = async () => `picturesLight-${userId || "all"}`;

  const fetchFunction = async (): Promise<PictureLight[]> => {
    const pictures = await prisma.picture.findMany({
      where: { userId: userId ? userId : undefined },
      orderBy: { createdAt: "desc" },
      select: pictureLightSelect,
    });

    return pictures.map((picture) => ({
      ...picture,
      sizes: picture.sizes as Sizes,
    }));
  };

  return withCache<PictureLight[]>(keyGenerator, fetchFunction);
};

const fetchAndCacheIndividualPictureDetails = async (
  pictureId: number,
  currentUser: CurrentUserType,
): Promise<UserPictureDetails> => {
  console.log("Fetching picture details for pictureId:", pictureId);
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

  const isCurrentUserFollowingProfile = getIsCurrentUserFollowingProfile(
    currentUser,
    picture.user.id,
  );

  return {
    currentUser,
    isCurrentUserFollowingProfile,
    comments,
    isLiked,
    isSaved,
    ...picture,
    sizes: picture.sizes as Sizes,
  };
};

export const getPictureDetails = async (
  pictureId: number,
): Promise<UserPictureDetails> => {
  const currentUser = await getCurrentUser();
  return fetchAndCacheIndividualPictureDetails(pictureId, currentUser);
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

  const pictures = await prisma.picture.findMany({
    where: whereClause,
    select: userPictureDetailsSelect,
  });

  const picturesWithDetails = await Promise.all(
    pictures.map((picture) =>
      fetchAndCacheIndividualPictureDetails(picture.id, currentUser),
    ),
  );

  return picturesWithDetails;
};
