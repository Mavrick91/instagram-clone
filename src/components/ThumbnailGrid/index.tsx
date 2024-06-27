import { UserPictureDetails } from "@/types/picture";

import ThumbnailGridItem from "./ThumbnailGridItem";

type ThumbnailGridProps = {
  pictures: UserPictureDetails[];
};

const ThumbnailGrid = ({ pictures }: ThumbnailGridProps) => {
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      {pictures.map((picture) => {
        return <ThumbnailGridItem key={picture.id} initialPicture={picture} />;
      })}
    </div>
  );
};

export default ThumbnailGrid;
