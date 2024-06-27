import { Prisma } from "@prisma/client";

import {
  PictureLight,
  pictureLightSelect,
  userPictureDetailsSelect,
} from "./picture";

export const lightCollectionByUserIdSelect = {
  id: true,
  nameId: true,
  name: true,
  isDefault: true,
  pictures: {
    select: {
      pictureId: true,
      picture: {
        select: pictureLightSelect,
      },
    },
  },
} as const;

export type LightCollectionByUserId = Omit<
  Prisma.CollectionGetPayload<{
    select: typeof lightCollectionByUserIdSelect;
  }>,
  "pictures"
> & {
  pictures: {
    pictureId: number;
    picture: PictureLight;
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
        select: userPictureDetailsSelect,
      },
    },
  },
} as const;

export type UserCollectionDetails = Omit<
  Prisma.CollectionGetPayload<{
    select: typeof userCollectionDetailsSelect;
  }>,
  "pictures"
> & {
  pictures: {
    picture: PictureLight;
  }[];
};
