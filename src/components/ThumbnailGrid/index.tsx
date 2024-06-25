import { PictureLight, UserPictureDetails } from "@/types/picture";

import ThumbnailGridItem from "./ThumbnailGridItem";

type ThumbnailGridProps = {
  pictures: UserPictureDetails[] | PictureLight[];
};

const ThumbnailGrid = ({ pictures }: ThumbnailGridProps) => {
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      {pictures.map((picture) => {
        return <ThumbnailGridItem initialPicture={picture} key={picture.id} />;
      })}
    </div>
  );
};

export default ThumbnailGrid;
