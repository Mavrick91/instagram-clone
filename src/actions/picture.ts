"use server";

import prisma from "@/lib/prisma";
import { PictureLight, Sizes, UserPictureDetails } from "@/types/picture";
import { getErrorMessage } from "@/utils";

import { getCurrentUser } from "./user";

export const getPicturesLight = async (
  userId?: number,
): Promise<PictureLight[]> => {
  const pictures = await prisma.picture.findMany({
    where: { userId: userId ? userId : undefined },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      altText: true,
      sizes: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  return pictures.map((picture) => ({
    ...picture,
    sizes: picture.sizes as Sizes,
  }));
};

export const getPictureDetails = async (
  pictureId: string,
): Promise<UserPictureDetails> => {
  try {
    const picture = await prisma.picture.findUnique({
      where: {
        id: parseInt(pictureId, 10),
      },
      select: {
        id: true,
        createdAt: true,
        disableComments: true,
        sizes: true,
        description: true,
        hideLikesAndViewCounts: true,
        altText: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            firstName: true,
            lastName: true,
          },
        },
        likes: {
          select: {
            userId: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!picture) {
      throw new Error("Picture not found");
    }

    return {
      ...picture,
      sizes: picture.sizes as Sizes,
    };
  } catch (error) {
    getErrorMessage(error);
    throw new Error("Unable to fetch picture details");
  }
};

export const getFollowedUsersPictures = async (): Promise<
  UserPictureDetails[]
> => {
  try {
    const currentUser = await getCurrentUser();

    const pictures = await prisma.picture.findMany({
      where: {
        user: {
          receivedFollows: {
            some: {
              initiatorId: currentUser.id,
            },
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        disableComments: true,
        sizes: true,
        description: true,
        hideLikesAndViewCounts: true,
        altText: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            firstName: true,
            lastName: true,
          },
        },
        likes: {
          select: {
            userId: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return pictures.map((picture) => ({
      ...picture,
      sizes: picture.sizes as Sizes,
    }));
  } catch (error) {
    getErrorMessage(error);
    throw new Error("Unable to fetch followed users' pictures");
  }
};
