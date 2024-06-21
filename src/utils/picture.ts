import {
  PictureLight,
  PictureLightWithJsonSizes,
  Sizes,
} from "@/types/picture";

export const transformLightPicture = (
  picture: PictureLightWithJsonSizes,
): PictureLight => {
  return {
    ...picture,
    sizes: picture.sizes as Sizes,
  };
};

export const transformCollectionPictures = (
  pictures: { pictureId: number; picture: PictureLightWithJsonSizes }[],
) => {
  return pictures.map((p) => ({
    pictureId: p.pictureId,
    picture: transformLightPicture(p.picture),
  }));
};
