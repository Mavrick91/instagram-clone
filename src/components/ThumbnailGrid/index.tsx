import { UserPictureDetails } from "@/types/picture";

import ThumbnailGridItem from "./ThumbnailGridItem";

type ThumbnailGridProps = {
  pictures: UserPictureDetails[];
};

const ThumbnailGrid = ({ pictures }: ThumbnailGridProps) => {
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      {pictures &&
        pictures.map((picture) => {
          return <ThumbnailGridItem picture={picture} key={picture.id} />;
        })}
    </div>
  );
};

export default ThumbnailGrid;
