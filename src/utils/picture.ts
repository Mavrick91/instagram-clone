import { PictureWithSizes, Sizes, WithSizes } from "@/types/picture";

export const transformPictureSizes = <T extends WithSizes>(
  picture: T,
): PictureWithSizes<T> => {
  return {
    ...picture,
    sizes: picture.sizes as Sizes,
  };
};
