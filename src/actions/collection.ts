"use server";

import { Collection } from "@prisma/client";

import { getPictureDetails } from "@/actions/picture";
import { getCurrentUser } from "@/actions/user";
import prisma from "@/lib/prisma";
import {
  LightCollectionByUserId,
  lightCollectionByUserIdSelect,
  UserCollectionDetails,
  userCollectionDetailsSelect,
} from "@/types/collection";
import { parseId } from "@/utils/IDParser";
import { transformPictureSizes } from "@/utils/picture";

export const getIsPictureInUserCollection = async (
  pictureId: number,
): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  const pictureInDefaultCollection = await prisma.pictureOnCollection.findFirst(
    {
      where: {
        pictureId: pictureId,
        collection: {
          userId: currentUser.id,
          isDefault: true,
        },
      },
    },
  );
  return !!pictureInDefaultCollection;
};

export const removePictureFromDefaultCollection = async (
  pictureId: number,
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
  } catch (error) {
    console.error("Error removing picture from the default saved:", error);
    throw new Error("Unable to remove picture from the collection.");
  }
};

export const removePictureFromCollection = async (
  pictureId: number,
  collectionId?: string,
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    await prisma.$transaction(async (prisma) => {
      if (!collectionId) {
        // Removing from all of the user's collections
        await prisma.pictureOnCollection.deleteMany({
          where: {
            pictureId: pictureId,
            collection: {
              userId: currentUser.id,
            },
          },
        });

        // Update isInAnyCollection and isSaved
        await prisma.picture.update({
          where: { id: pictureId },
          data: {
            isInAnyCollection: false,
          },
        });
      } else {
        const collectionPicture = await prisma.collection.findFirst({
          where: {
            userId: currentUser.id,
            id: parseInt(collectionId, 10),
          },
        });
        if (!collectionPicture) throw new Error("Collection not found");

        // Removing from a specific collection
        const pictureExisting = await prisma.pictureOnCollection.findFirst({
          where: {
            pictureId: pictureId,
            collectionId: collectionPicture.id,
            collection: {
              userId: currentUser.id,
            },
          },
        });

        if (!pictureExisting) {
          throw new Error("Picture not in collection");
        }

        await prisma.pictureOnCollection.delete({
          where: {
            pictureId_collectionId: {
              pictureId: pictureId,
              collectionId: collectionPicture.id,
            },
          },
        });

        // Check if the picture is still in any collection
        const remainingCollections = await prisma.pictureOnCollection.findFirst(
          {
            where: {
              pictureId: pictureId,
              collection: {
                userId: currentUser.id,
                isDefault: false,
              },
            },
          },
        );

        // Update isInAnyCollection if no collections left
        if (!remainingCollections) {
          await prisma.picture.update({
            where: { id: pictureId },
            data: { isInAnyCollection: false },
          });
        }
      }
    });
  } catch (error) {
    console.error("Error removing picture from collection(s):", error);
    throw new Error("Unable to remove picture from the collection(s).");
  }
};

export const addPictureToCollectionById = async (
  collectionId: number,
  pictureIds: number[],
): Promise<void> => {
  try {
    // First, get the collection to check if it's the default collection
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { isDefault: true },
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    // Find existing pictures in the collection
    const existingPictures = await prisma.pictureOnCollection.findMany({
      where: {
        pictureId: { in: pictureIds },
        collectionId: collectionId,
      },
    });

    const existingPictureIds = existingPictures.map((pic) => {
      return pic.pictureId;
    });

    // Filter out pictures that are already in the collection
    const newPictureIds = pictureIds.filter((picId) => {
      return !existingPictureIds.includes(picId);
    });

    // Perform operations in a transaction to ensure consistency
    await prisma.$transaction(async (prisma) => {
      // Add new pictures to the collection
      await prisma.pictureOnCollection.createMany({
        data: newPictureIds.map((pictureId) => {
          return {
            collectionId: collectionId,
            pictureId,
          };
        }),
        skipDuplicates: true,
      });

      // Update isInAnyCollection for all new pictures
      await prisma.picture.updateMany({
        where: { id: { in: newPictureIds } },
        data: {
          isInAnyCollection: true,
        },
      });
    });
  } catch (error) {
    console.error("Error adding pictures to collection:", error);
    throw new Error("Unable to add pictures to the collection.");
  }
};

export const addPictureToDefaultCollection = async (
  pictureId: number,
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
  } catch (error) {
    console.error("Error adding picture to the default saved:", error);
    throw new Error("Unable to add picture to the collection.");
  }
};

export const getCollectionsByUserId = async (
  userId: number,
): Promise<LightCollectionByUserId[]> => {
  const collections = await prisma.collection.findMany({
    where: {
      userId: userId,
    },
    select: lightCollectionByUserIdSelect,
    orderBy: { createdAt: "asc" },
  });

  return collections.map((collection) => ({
    ...collection,
    pictures: collection.pictures.map((p) => ({
      pictureId: p.pictureId,
      picture: transformPictureSizes(p.picture),
    })),
  }));
};

export const getDefaultCollectionByUsername = async (
  username: string,
): Promise<LightCollectionByUserId> => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      username: username,
    },
  });

  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      userId: user.id,
      isDefault: true,
    },
    select: lightCollectionByUserIdSelect,
  });

  return {
    ...collection,
    pictures: collection.pictures.map((p) => ({
      pictureId: p.pictureId,
      picture: transformPictureSizes(p.picture),
    })),
  };
};

export const getUserCollectionDetails = async (
  username: string,
  collectionId: string | number,
): Promise<UserCollectionDetails> => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      username: username,
    },
  });

  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      userId: user.id,
      id: parseId(collectionId),
    },
    select: userCollectionDetailsSelect,
  });

  const picturesWithDetails = await Promise.all(
    collection.pictures.map(async (p) => {
      return {
        picture: await getPictureDetails(p.picture.id),
      };
    }),
  );

  return {
    ...collection,
    pictures: picturesWithDetails,
  };
};

export const createCollectionAndAddPictures = async (
  collectionName: string,
  pictureIds: number[],
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

    const existingPictureIds = existingPictures.map((pic) => {
      return pic.pictureId;
    });
    const newPictureIds = pictureIds.filter((picId) => {
      return !existingPictureIds.includes(picId);
    });

    // Add pictures to the new collection
    await prisma.pictureOnCollection.createMany({
      data: newPictureIds.map((pictureId) => {
        return {
          collectionId: newCollection.id,
          pictureId,
        };
      }),
      skipDuplicates: true,
    });

    // Update the state of the newly added pictures
    if (newPictureIds.length > 0) {
      await prisma.picture.updateMany({
        where: { id: { in: newPictureIds } },
        data: {
          isInAnyCollection: true,
        },
      });
    }

    return newCollection;
  };

  try {
    return await prisma.$transaction(transaction);
  } catch (error) {
    console.error("Error creating collection and adding pictures:", error);
    throw new Error("Unable to create collection.");
  }
};

export const deleteCollection = async (collectionId: number): Promise<void> => {
  if (!collectionId) {
    throw new Error("Invalid collectionId provided.");
  }

  try {
    const currentUser = await getCurrentUser();

    await prisma.$transaction(async (prisma) => {
      // Check if the collection to be deleted is not the default one
      const collectionToDelete = await prisma.collection.findUnique({
        where: { id: collectionId },
        select: { isDefault: true },
      });

      if (!collectionToDelete || collectionToDelete.isDefault) {
        throw new Error("Cannot delete the default collection.");
      }

      // Get all pictures in the collection
      const picturesInCollection = await prisma.pictureOnCollection.findMany({
        where: { collectionId },
        select: { pictureId: true },
      });

      // Delete all picture-collection associations
      await prisma.pictureOnCollection.deleteMany({
        where: { collectionId },
      });

      // Delete the collection
      await prisma.collection.delete({
        where: { id: collectionId },
      });

      // Check and update isInAnyCollection for each picture
      for (const { pictureId } of picturesInCollection) {
        const remainingCollections = await prisma.pictureOnCollection.findFirst(
          {
            where: {
              pictureId,
              collection: {
                userId: currentUser.id,
                isDefault: false, // Exclude the default collection
              },
            },
          },
        );

        if (!remainingCollections) {
          await prisma.picture.update({
            where: { id: pictureId },
            data: {
              isInAnyCollection: false,
            },
          });
        }
      }
    });
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw new Error("Unable to delete the collection.");
  }
};

export const updateCollectionName = async (
  collectionId: number,
  newName: string,
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
  } catch (error) {
    console.error("Error updating saved name:", error);
    throw new Error("Unable to update saved name.");
  }
};
