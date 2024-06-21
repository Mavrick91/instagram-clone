import { useEffect, useState } from "react";

import { PictureLight } from "@/types/picture";

type Props = {
  picture: PictureLight;
};

const ImageWithPlaceholder = ({ picture }: Props) => {
  const [currentImageUrl, setCurrentImageUrl] = useState(
    picture.sizes.thumbnail,
  );

  useEffect(() => {
    const img = new Image();
    img.src = picture.sizes.original;
    img.onload = () => {
      setCurrentImageUrl(picture.sizes.original);
    };
    img.onerror = () => {
      console.error("Failed to load the image:", picture.sizes.original);
    };
  }, [picture.sizes.original]);

  return <img src={currentImageUrl} alt={picture.altText || ""} />;
};

export default ImageWithPlaceholder;
