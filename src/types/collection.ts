import { Prisma } from "@prisma/client";

import {
  pictureLightSelect,
  PictureLightType,
  PictureWithSizes,
  UserPictureDetails,
  userPictureDetailsSelect,
} from "./picture";

export const lightCollectionByUserIdSelect: Prisma.collectionSelect = {
  id: true,
  name_id: true,
  name: true,
  is_default: true,
  pictures: {
    select: {
      picture_id: true,
      picture: {
        select: pictureLightSelect,
      },
    },
  },
};

export type LightCollectionByUserId = Omit<
  Prisma.collectionGetPayload<{
    select: typeof lightCollectionByUserIdSelect;
  }>,
  "pictures"
> & {
  pictures: {
    pictureId: number;
    picture: PictureWithSizes<PictureLightType>;
  }[];
};
export const userCollectionDetailsSelect: Prisma.collectionSelect = {
  id: true,
  name_id: true,
  name: true,
  is_default: true,
  pictures: {
    select: {
      picture: {
        select: userPictureDetailsSelect,
      },
    },
  },
};

export type UserCollectionDetails = Omit<
  Prisma.collectionGetPayload<{
    select: typeof userCollectionDetailsSelect;
  }>,
  "pictures"
> & {
  pictures: {
    picture: UserPictureDetails;
  }[];
};
