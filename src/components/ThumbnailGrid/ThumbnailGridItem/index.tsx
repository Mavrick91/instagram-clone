import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import ImageClient from "@/components/ImageClient";
import { PictureLight } from "@/types/picture";

type Props = {
  picture: PictureLight;
};

function ThumbnailGridItem({ picture }: Props) {
  return (
    <>
      <Link
        href={`/p/${picture.id}`}
        key={picture.id}
        className="group relative col-span-1 aspect-square overflow-hidden bg-highlight-background"
      >
        <ImageClient
          width={317}
          height={317}
          alt={picture.altText || "Picture"}
          className="size-full overflow-hidden object-cover"
          src={picture.sizes.thumbnail}
          priority
        />
        <div className="absolute inset-0 z-20 hidden items-center justify-center gap-3 bg-black/50  text-white group-hover:flex">
          <MessageCircle fill="white" size={32} />
          <span className="text-2xl">{picture._count?.comments}</span>
        </div>
      </Link>

      {/*{selectedPicture && (*/}
      {/*  <PictureDetailsDialog*/}
      {/*    picture={selectedPicture}*/}
      {/*    onClose={() => setSelectedPicture(null)}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
}

export default memo(ThumbnailGridItem);
