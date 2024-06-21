import { PictureLight } from "@/types/picture";

import ThumbnailGridItem from "./ThumbnailGridItem";

type ThumbnailGridProps = {
  pictures: PictureLight[];
};

function ThumbnailGrid({ pictures }: ThumbnailGridProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      {pictures &&
        pictures.map((picture) => (
          <ThumbnailGridItem picture={picture} key={picture.id} />
        ))}
    </div>
  );
}

export default ThumbnailGrid;
