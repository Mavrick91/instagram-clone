"use server";

import { Collection } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/actions/user";
import prisma from "@/lib/prisma";
import {
  CollectionByUserId,
  collectionByUserIdSelect,
  UserCollectionDetailsSelect,
  userCollectionDetailsSelect,
  UserDefaultCollectionPictures,
  userDefaultCollectionPicturesSelect,
} from "@/types/collection";
import { RevalidatePath } from "@/types/global";

export const isPictureInUserCollection = async (
  pictureId: number,
): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();

    const pictureInDefaultCollection =
      await prisma.pictureOnCollection.findFirst({
        where: {
          pictureId: pictureId,
          collection: {
            userId: currentUser.id,
            isDefault: true,
          },
        },
      });

    return !!pictureInDefaultCollection;
  } catch (error) {
    console.error("Error checking if picture is in saved:", error);
    throw new Error("Unable to check if picture is in saved.");
  }
};

export const removePictureFromDefaultCollection = async (
  pictureId: number,
  options?: RevalidatePath,
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const defaultCollection = await prisma.collection.findFirstOrThrow({
      where: {
        userId: currentUser.id,
        isDefault: true,
      },
    });

    const pictureExisting = await prisma.pictureOnCollection.findFirst({
      where: {
        pictureId: pictureId,
        collectionId: defaultCollection.id,
      },
    });

    if (!pictureExisting) throw new Error("Picture not in collection");

    await prisma.pictureOnCollection.delete({
      where: {
        pictureId_collectionId: {
          pictureId: pictureId,
          collectionId: defaultCollection.id,
        },
      },
    });

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error removing picture from the default saved:", error);
    throw new Error("Unable to remove picture from the collection.");
  }
};

export const addPictureToCollectionById = async (
  collectionId: number,
  pictureId: number[],
  options?: RevalidatePath,
): Promise<void> => {
  try {
    const existingPictures = await prisma.pictureOnCollection.findMany({
      where: {
        pictureId: {
          in: pictureId,
        },
        collectionId: collectionId,
      },
    });

    const existingPictureIds = existingPictures.map((pic) => pic.pictureId);

    const newPictureIds = pictureId.filter(
      (picId) => !existingPictureIds.includes(picId),
    );

    await Promise.all(
      newPictureIds.map((pictureId) =>
        prisma.pictureOnCollection.create({
          data: {
            collectionId: collectionId,
            pictureId,
          },
        }),
      ),
    );

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error adding picture to collection:", error);
    throw new Error("Unable to add picture to the collection.");
  }
};

export const addPictureToDefaultCollection = async (
  pictureId: number,
  options?: RevalidatePath,
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const defaultCollection = await prisma.collection.findFirstOrThrow({
      where: {
        userId: currentUser.id,
        isDefault: true,
      },
    });

    const pictureExisting = await prisma.pictureOnCollection.findFirst({
      where: {
        pictureId: pictureId,
        collectionId: defaultCollection.id,
      },
    });

    if (pictureExisting)
      throw new Error("Picture already in default collection.");

    await prisma.pictureOnCollection.create({
      data: {
        pictureId: pictureId,
        collectionId: defaultCollection.id,
      },
    });

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error adding picture to the default saved:", error);
    throw new Error("Unable to add picture to the collection.");
  }
};

export const getCollectionsByUserId = async (
  userId: number,
): Promise<CollectionByUserId[]> => {
  try {
    return prisma.collection.findMany({
      where: {
        userId: userId,
      },
      select: collectionByUserIdSelect,
    });
  } catch (error) {
    console.error("Error fetching saved by username:", error);
    throw new Error("Unable to fetch the collections.");
  }
};

export const getDefaultCollectionByUsername = async (
  username: string,
): Promise<UserDefaultCollectionPictures> => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        username: username,
      },
    });

    return prisma.collection.findFirstOrThrow({
      where: {
        userId: user.id,
        isDefault: true,
      },
      select: userDefaultCollectionPicturesSelect,
    });
  } catch (error) {
    console.error("Error fetching default saved:", error);
    throw new Error("Unable to fetch the default collection.");
  }
};

export const getUserCollectionDetails = async (
  username: string,
  collectionName: string,
): Promise<UserCollectionDetailsSelect | null> => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        username: username,
      },
    });

    return prisma.collection.findFirst({
      where: {
        userId: user.id,
        nameId: collectionName,
      },
      select: userCollectionDetailsSelect,
    });
  } catch (error) {
    console.error("Error fetching saved details:", error);
    throw new Error("Unable to fetch the collection.");
  }
};

export const createCollectionAndAddPictures = async (
  collectionName: string,
  pictureIds: number[],
  options?: RevalidatePath,
): Promise<Collection> => {
  const currentUser = await getCurrentUser();

  const transaction = async () => {
    const newCollection = await prisma.collection.create({
      data: {
        name: collectionName,
        nameId: collectionName.toLowerCase().replace(/ /g, "-"),
        isDefault: false,
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    const existingPictures = await prisma.pictureOnCollection.findMany({
      where: {
        pictureId: {
          in: pictureIds,
        },
        collectionId: newCollection.id,
      },
    });

    const existingPictureIds = existingPictures.map((pic) => pic.pictureId);

    const newPictureIds = pictureIds.filter(
      (picId) => !existingPictureIds.includes(picId),
    );

    await Promise.all(
      newPictureIds.map((pictureId) =>
        prisma.pictureOnCollection.create({
          data: {
            collectionId: newCollection.id,
            pictureId,
          },
        }),
      ),
    );

    return newCollection;
  };

  try {
    const newCollection = await prisma.$transaction(transaction);

    options && revalidatePath(options.originalPath, options?.type);

    return newCollection;
  } catch (error) {
    console.error("Error creating saved and adding pictures:", error);
    throw new Error("Unable to create collection.");
  }
};

export const deleteCollection = async (
  collectionId: number,
  options?: RevalidatePath,
): Promise<void> => {
  if (!collectionId) {
    throw new Error("Invalid collectionId provided.");
  }

  const transaction = async () => {
    await prisma.pictureOnCollection.deleteMany({
      where: { collectionId },
    });

    await prisma.collection.delete({
      where: { id: collectionId },
    });
  };

  try {
    await prisma.$transaction(transaction);

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error deleting saved:", error);
    throw new Error("Unable to delete the collection.");
  }
};

export const updateCollectionName = async (
  collectionId: number,
  newName: string,
  options?: RevalidatePath,
): Promise<void> => {
  try {
    await prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        name: newName,
        nameId: newName.toLowerCase().replace(/ /g, "-"),
      },
    });

    options && revalidatePath(options.originalPath, options?.type);
  } catch (error) {
    console.error("Error updating saved name:", error);
    throw new Error("Unable to update saved name.");
  }
};
