"use server";

import { collections } from "@prisma/client";

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
  const pictureInDefaultCollection =
    await prisma.picture_on_collections.findFirst({
      where: {
        picture_id: pictureId,
        collection: {
          user_id: currentUser.id,
          is_default: true,
        },
      },
    });
  return !!pictureInDefaultCollection;
};

export const removePictureFromDefaultCollection = async (
  pictureId: number,
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const defaultCollection = await prisma.collections.findFirstOrThrow({
      where: {
        user_id: currentUser.id,
        is_default: true,
      },
    });

    const pictureExisting = await prisma.picture_on_collections.findFirst({
      where: {
        picture_id: pictureId,
        collection_id: defaultCollection.id,
      },
    });

    if (!pictureExisting) throw new Error("Picture not in collection");

    await prisma.picture_on_collections.delete({
      where: {
        picture_id_collection_id: {
          picture_id: pictureId,
          collection_id: defaultCollection.id,
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
        await prisma.picture_on_collections.deleteMany({
          where: {
            picture_id: pictureId,
            collection: {
              user_id: currentUser.id,
            },
          },
        });

        // Update isInAnyCollection and isSaved
        await prisma.pictures.update({
          where: { id: pictureId },
          data: {
            is_in_any_collection: false,
          },
        });
      } else {
        const collectionPicture = await prisma.collections.findFirst({
          where: {
            user_id: currentUser.id,
            id: parseInt(collectionId, 10),
          },
        });
        if (!collectionPicture) throw new Error("Collection not found");

        // Removing from a specific collection
        const pictureExisting = await prisma.picture_on_collections.findFirst({
          where: {
            picture_id: pictureId,
            collection_id: collectionPicture.id,
            collection: {
              user_id: currentUser.id,
            },
          },
        });

        if (!pictureExisting) {
          throw new Error("Picture not in collection");
        }

        await prisma.picture_on_collections.delete({
          where: {
            picture_id_collection_id: {
              picture_id: pictureId,
              collection_id: collectionPicture.id,
            },
          },
        });

        // Check if the picture is still in any collection
        const remainingCollections =
          await prisma.picture_on_collections.findFirst({
            where: {
              picture_id: pictureId,
              collection: {
                user_id: currentUser.id,
                is_default: false,
              },
            },
          });

        // Update isInAnyCollection if no collections left
        if (!remainingCollections) {
          await prisma.pictures.update({
            where: { id: pictureId },
            data: { is_in_any_collection: false },
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
    const collection = await prisma.collections.findUnique({
      where: { id: collectionId },
      select: { is_default: true },
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    // Find existing pictures in the collection
    const existingPictures = await prisma.picture_on_collections.findMany({
      where: {
        picture_id: { in: pictureIds },
        collection_id: collectionId,
      },
    });

    const existingPictureIds = existingPictures.map((pic) => {
      return pic.picture_id;
    });

    // Filter out pictures that are already in the collection
    const newPictureIds = pictureIds.filter((picId) => {
      return !existingPictureIds.includes(picId);
    });

    // Perform operations in a transaction to ensure consistency
    await prisma.$transaction(async (prisma) => {
      // Add new pictures to the collection
      await prisma.picture_on_collections.createMany({
        data: newPictureIds.map((pictureId) => {
          return {
            collection_id: collectionId,
            picture_id: pictureId,
          };
        }),
        skipDuplicates: true,
      });

      // Update isInAnyCollection for all new pictures
      await prisma.pictures.updateMany({
        where: { id: { in: newPictureIds } },
        data: {
          is_in_any_collection: true,
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

    const defaultCollection = await prisma.collections.findFirstOrThrow({
      where: {
        user_id: currentUser.id,
        is_default: true,
      },
    });

    const pictureExisting = await prisma.picture_on_collections.findFirst({
      where: {
        picture_id: pictureId,
        collection_id: defaultCollection.id,
      },
    });

    if (pictureExisting)
      throw new Error("Picture already in default collection.");

    await prisma.picture_on_collections.create({
      data: {
        picture_id: pictureId,
        collection_id: defaultCollection.id,
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
  const collections = await prisma.collections.findMany({
    where: {
      user_id: userId,
    },
    select: lightCollectionByUserIdSelect,
    orderBy: { created_at: "asc" },
  });

  return collections.map((collection) => ({
    ...collection,
    pictures: collection.pictures.map((p) => ({
      pictureId: p.picture_id,
      picture: transformPictureSizes(p.picture),
    })),
  }));
};

export const getDefaultCollectionByUsername = async (
  username: string,
): Promise<LightCollectionByUserId> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      username: username,
    },
  });

  const collection = await prisma.collections.findFirstOrThrow({
    where: {
      user_id: user.id,
      is_default: true,
    },
    select: lightCollectionByUserIdSelect,
  });

  return {
    ...collection,
    pictures: collection.pictures.map((p) => ({
      pictureId: p.picture_id,
      picture: transformPictureSizes(p.picture),
    })),
  };
};

export const getUserCollectionDetails = async (
  username: string,
  collectionId: string | number,
): Promise<UserCollectionDetails> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      username: username,
    },
  });

  const collection = await prisma.collections.findFirstOrThrow({
    where: {
      user_id: user.id,
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
): Promise<collections> => {
  const currentUser = await getCurrentUser();

  const transaction = async () => {
    const newCollection = await prisma.collections.create({
      data: {
        name: collectionName,
        name_id: collectionName.toLowerCase().replace(/ /g, "-"),
        is_default: false,
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    const existingPictures = await prisma.picture_on_collections.findMany({
      where: {
        picture_id: {
          in: pictureIds,
        },
        collection_id: newCollection.id,
      },
    });

    const existingPictureIds = existingPictures.map((pic) => {
      return pic.picture_id;
    });
    const newPictureIds = pictureIds.filter((picId) => {
      return !existingPictureIds.includes(picId);
    });

    // Add pictures to the new collection
    await prisma.picture_on_collections.createMany({
      data: newPictureIds.map((pictureId) => {
        return {
          collection_id: newCollection.id,
          picture_id: pictureId,
        };
      }),
      skipDuplicates: true,
    });

    // Update the state of the newly added pictures
    if (newPictureIds.length > 0) {
      await prisma.pictures.updateMany({
        where: { id: { in: newPictureIds } },
        data: {
          is_in_any_collection: true,
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
      const collectionToDelete = await prisma.collections.findUnique({
        where: { id: collectionId },
        select: { is_default: true },
      });

      if (!collectionToDelete || collectionToDelete.is_default) {
        throw new Error("Cannot delete the default collection.");
      }

      // Get all pictures in the collection
      const picturesInCollection = await prisma.picture_on_collections.findMany(
        {
          where: { collection_id: collectionId },
          select: { picture_id: true },
        },
      );

      // Delete all picture-collection associations
      await prisma.picture_on_collections.deleteMany({
        where: { collection_id: collectionId },
      });

      // Delete the collection
      await prisma.collections.delete({
        where: { id: collectionId },
      });

      // Check and update is_in_any_collection for each picture
      for (const { picture_id } of picturesInCollection) {
        const remainingCollections =
          await prisma.picture_on_collections.findFirst({
            where: {
              picture_id,
              collection: {
                user_id: currentUser.id,
                is_default: false, // Exclude the default collection
              },
            },
          });

        if (!remainingCollections) {
          await prisma.pictures.update({
            where: { id: picture_id },
            data: {
              is_in_any_collection: false,
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
    await prisma.collections.update({
      where: {
        id: collectionId,
      },
      data: {
        name: newName,
        name_id: newName.toLowerCase().replace(/ /g, "-"),
      },
    });
  } catch (error) {
    console.error("Error updating saved name:", error);
    throw new Error("Unable to update saved name.");
  }
};
