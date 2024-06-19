import { Prisma } from "@prisma/client";

import { pictureLightSelect, Sizes } from "./picture";

export const collectionByUserIdSelect = {
  nameId: true,
  name: true,
  isDefault: true,
  pictures: {
    select: {
      pictureId: true,
      picture: {
        select: {
          id: true,
          sizes: true,
        },
      },
    },
  },
} as const;

type CollectionByUserIdBase = Prisma.CollectionGetPayload<{
  select: typeof collectionByUserIdSelect;
}>;

// Extend the base type with the correct type for sizes
export type CollectionByUserId = Omit<CollectionByUserIdBase, "pictures"> & {
  pictures: {
    picture: Omit<
      CollectionByUserIdBase["pictures"][number]["picture"],
      "sizes"
    > & {
      sizes: Sizes;
    };
  }[];
};

export const userCollectionDetailsSelect = {
  id: true,
  nameId: true,
  name: true,
  isDefault: true,
  pictures: {
    select: {
      picture: {
        select: pictureLightSelect,
      },
    },
  },
} as const;

export type UserCollectionDetailsSelect = Prisma.CollectionGetPayload<{
  select: typeof userCollectionDetailsSelect;
}>;

export const userDefaultCollectionPicturesSelect = {
  pictures: {
    include: {
      picture: {
        select: {
          id: true,
          sizes: true,
        },
      },
    },
  },
};

type UserDefaultCollectionPicturesBase = Prisma.CollectionGetPayload<{
  select: typeof collectionByUserIdSelect;
}>;

export type UserDefaultCollectionPictures = Omit<
  UserDefaultCollectionPicturesBase,
  "pictures"
> & {
  pictures: {
    picture: Omit<
      CollectionByUserIdBase["pictures"][number]["picture"],
      "sizes"
    > & {
      sizes: Sizes;
    };
  }[];
};
