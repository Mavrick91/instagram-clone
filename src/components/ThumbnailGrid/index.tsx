import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getPictureDetails } from "@/actions/picture";
import getQueryClient from "@/lib/queryClient";
import { UserPictureDetails } from "@/types/picture";

import ThumbnailGridItem from "./ThumbnailGridItem";

type ThumbnailGridProps = {
  pictures: UserPictureDetails[];
};

const ThumbnailGrid = async ({ pictures }: ThumbnailGridProps) => {
  const queryClient = getQueryClient();

  await Promise.all(
    pictures.map(async (picture) => {
      await queryClient.prefetchQuery({
        queryKey: ["picture", picture.id],
        queryFn: () => {
          return getPictureDetails(picture.id);
        },
      });
    }),
  );

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="grid w-full grid-cols-3 gap-1">
        {pictures.map((picture) => {
          return <ThumbnailGridItem serverPicture={picture} key={picture.id} />;
        })}
      </div>
    </HydrationBoundary>
  );
};

export default ThumbnailGrid;
